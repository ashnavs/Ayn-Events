
import React, { useState, useEffect } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { useSocket } from '../../services/socketProvider'; 
import Header from '../../components/Header'
import EmojiPicker from 'emoji-picker-react'

import { GrEmoji } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";

const UserChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const { socket } = useSocket(); // Use socket from context
  const user = useSelector(selectUser);
  const userId = user.id;

  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        const response = await axiosInstanceUser.get(`/active-chats/${userId}`);
        setActiveChats(response.data);
      } catch (error) {
        console.error('Error fetching active chats:', error);
      }
    };

    fetchActiveChats();
  }, [userId]);

 useEffect(() => {
  if (selectedRoom) {
    socket.emit('join_room', selectedRoom);

    const handleReceiveMessage = (newMessage) => {
      if (newMessage.chat === selectedRoom) {

          setMessagesByRoom((prevMessagesByRoom) => {
            const updatedMessages = {
              ...prevMessagesByRoom,
              [selectedRoom]: [
                ...(prevMessagesByRoom[selectedRoom] || []),
                newMessage,
              ],
            };
            return updatedMessages;
          });

        
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }
}, [socket, selectedRoom]);


  useEffect(() => {
    if (socket) {
      socket.on('message', (newMessage) => {
        setMessagesByRoom((prevMessagesByRoom) => ({
          ...prevMessagesByRoom,
          [newMessage.roomId]: [
            ...(prevMessagesByRoom[newMessage.roomId] || []),
            newMessage,
          ],
        }));
      });
  
      return () => {
        socket.off('message');
      };
    }
  }, [socket]);
  

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);

    const fetchMessagesForRoom = async () => {
      try {
        const response = await axiosInstanceUser.get(`/messages/${roomId}`);
        console.log('Fetched messages:', response.data);

        const messages = response.data.messages || [];

        setMessagesByRoom((prevMessagesByRoom) => ({
          ...prevMessagesByRoom,
          [roomId]: messages,
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchRoomDetails = async () => {
      try {
        const response = await axiosInstanceUser.get(`/rooms/${roomId}`);
        const { vendor, user } = response.data;
        setVendorData(vendor);
        setUserData(user);
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchMessagesForRoom();
    fetchRoomDetails();
  };

  const handleSendMessage = () => {
    if (selectedRoom && messageInput) {
      const newMessage = {
        roomId: selectedRoom,
        userId: userId,
        message: messageInput,
        senderModel: 'User',
      };
  
      socket.emit('sendMessage', newMessage); // Send message to WebSocket server
  

      //its commented due to the doubling of msgs
      setMessagesByRoom((prevMessagesByRoom) => {
        const updatedMessages = {
          ...prevMessagesByRoom,
          [selectedRoom]: [
            ...(prevMessagesByRoom[selectedRoom] || []),
            newMessage,
          ],
        };
        console.log('Messages updated:', updatedMessages); // Debugging line
        return updatedMessages;
      });
      
      setMessageInput(''); // Clear the input field after sending the message
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false); // Hide emoji picker after selecting an emoji
  };
  
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Header/> */}
      {/* Sidebar for Active Rooms */}
      <div className="w-1/4 border-r border-gray-200 p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="mb-4">
          {activeChats.length === 0 ? (
            <p className="text-gray-500">No active chats.</p>
          ) : (
            activeChats.map((chat) => (
              <div
                key={chat._id}
                className={`p-3 rounded-lg mb-3 cursor-pointer ${
                  selectedRoom === chat._id ? 'bg-blue-100' : 'bg-gray-50'
                }`}
                onClick={() => handleRoomSelect(chat._id)}
              >
                {chat.users.map((user) => (
                  <p key={user._id}>{user.name}</p>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-lg font-bold">{vendorData ? vendorData.name : 'Vendor'}</h3>
          <p className="text-gray-600">{userData ? userData.name : 'User'}</p>
        </div>

        {/* Messages Display */}
        <div className="flex-grow overflow-y-auto p-4">
          {selectedRoom ? (
            Array.isArray(messagesByRoom[selectedRoom]) ? (
              messagesByRoom[selectedRoom].map((msg, index) => (
                <div
                  key={`${msg._id}-${index}`} // Ensure key is unique
                  className={`mb-2 p-2 rounded-lg max-w-xs ${msg.senderModel === 'User' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'}`}
                >
                  {msg.content}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages available.</p>
            )
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              Select a room to start messaging.
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedRoom && (
          <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
            <button
              className="p-2 bg-[#ccc89b] rounded-full hover:bg-[#ccc89b]"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <GrEmoji />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="bg-[#a39f74] text-white p-2 rounded-full hover:bg-[#ccc89b]"
              onClick={handleSendMessage}
            >
              <IoIosSend />
            </button>
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-8 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default UserChat;

