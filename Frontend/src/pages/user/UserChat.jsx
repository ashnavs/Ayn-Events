import React, { useState, useEffect } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { useSocket } from '../../services/socketProvider';
import Header from '../../components/Header';
import EmojiPicker from 'emoji-picker-react';
import { GrEmoji } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";


const UserChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);



  const { socket } = useSocket(); // Use socket from context
  const user = useSelector(selectUser);
  const userId = user.id;
  console.log(userId)

  // Fetch active chats when userId changes
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
    if (socket) {
      console.log('Socket connected:', socket.id); // Check if the socket is connected
  
      const handleReceiveMessage = (newMessage) => {
        console.log('Received message on frontend:', newMessage);
        setMessagesByRoom(prevMessagesByRoom => {
          const roomMessages = prevMessagesByRoom[newMessage.chat] || [];
          return {
            ...prevMessagesByRoom,
            [newMessage.chat]: [...roomMessages, newMessage],
          };
        });
      };
      
  
      socket.on('receiveMessage', handleReceiveMessage);
  
      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket]);
  
  
  

  // Handle room selection and joining
  useEffect(() => {
    if (selectedRoom && socket) {
      console.log(`Joining room ${selectedRoom}`);
      socket.emit('join_room', selectedRoom);

      return () => {
        console.log(`Leaving room ${selectedRoom}`);
        socket.emit('leave_room', selectedRoom);
      };
    }
  }, [selectedRoom, socket]);


  const handleSendMessage = async () => {
    if (socket) {
      if (selectedRoom && userId) {
        const roomId = selectedRoom;
        const sender = userId;
        const senderModel = 'User';
        
        let fileData = null;
        
        if (selectedFile) {
          try {
            fileData = {
              fileBase64: await convertFileToBase64(selectedFile),
              fileName: selectedFile.name,
              fileType: selectedFile.type,
              fileUrl: URL.createObjectURL(selectedFile),
            };
          } catch (error) {
            console.error('Error converting file to base64:', error);
            return;
          }
        }
        
        const messageData = {
          roomId,
          sender,
          content: messageInput,
          senderModel,
          ...fileData,
        };
  
        try {
          console.log('Sending message data:', messageData);
          socket.emit('sendMessage', messageData);
          if(messageData.senderModel !== 'User'){
            setMessagesByRoom((prevMessagesByRoom) => {
              const roomMessages = prevMessagesByRoom[roomId] || [];
              return {
                ...prevMessagesByRoom,
                [roomId]: [...roomMessages, messageData],
              };
            });
          }
          
  
          setMessageInput('');
          setShowEmojiPicker(false);
          setSelectedFile(null);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        console.error('Room ID or User ID is missing.');
      }
    } else {
      console.error('Socket is not set.');
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 part
      reader.onerror = (error) => reject(error);
    });
  };
  
  
  

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  


  // Fetch messages and room details when a room is selected
  useEffect(() => {
    if (selectedRoom) {
      const fetchMessagesForRoom = async () => {
        try {
          const response = await axiosInstanceUser.get(`/messages/${selectedRoom}`);
          console.log('Fetched messages:', response.data);

          const messages = response.data.messages || [];

          setMessagesByRoom((prevMessagesByRoom) => ({
            ...prevMessagesByRoom,
            [selectedRoom]: messages,
          }));
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      const fetchRoomDetails = async () => {
        try {
          const response = await axiosInstanceUser.get(`/rooms/${selectedRoom}`);
          const { vendor, user } = response.data;
          setVendorData(vendor);
          setUserData(user);
        } catch (error) {
          console.error('Error fetching room details:', error);
        }
      };

      fetchMessagesForRoom();
      fetchRoomDetails();
    }
  }, [selectedRoom]);

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false); // Hide emoji picker after selecting an emoji
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Active Chats */}
      <div className="w-1/4 border-r border-gray-200 p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Active Chats</h3>
          {activeChats.length === 0 ? (
            <p className="text-gray-500">No active chats.</p>
          ) : (
            activeChats.map((chat) => (
              <div
                key={chat._id}
                className={`p-3 rounded-lg mb-3 cursor-pointer ${
                  selectedRoom === chat._id ? 'bg-blue-100' : 'bg-gray-50'
                }`}
                onClick={() => setSelectedRoom(chat._id)}
              >
                <p>{chat.users.find((u) => u._id !== userId)?.name || "Unknown User"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Messages Display */}
        <div className="flex-grow overflow-y-auto p-4">
          {selectedRoom ? (
            (messagesByRoom[selectedRoom] || []).length > 0 ? (
              (messagesByRoom[selectedRoom] || []).map((msg) => (
                <div
                  key={msg._id} // Unique key for each message
                  className={`mb-2 p-2 rounded-lg max-w-xs ${
                    msg.senderModel === 'User' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'
                  }`}
                >
                  {msg.content && <p>{msg.content}</p>}
                  {msg.fileUrl && msg.fileType.startsWith('video/') ? (
                    <video
                      controls
                      src={msg.fileUrl}
                      className="mt-2 max-w-full h-auto rounded-lg"
                      style={{ maxHeight: '300px' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : msg.fileUrl && msg.fileType === 'application/pdf' ? (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-blue-500"
                    >
                      {msg.fileName}
                    </a>
                  ) : msg.fileUrl ? (
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName}
                      className="mt-2 max-w-full h-auto rounded-lg"
                    />
                  ) : null}
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )
          ) : (
            <p>Select a chat to start messaging</p>
          )}
        </div>

        {/* Message Input */}
        {selectedRoom && (
          <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
            <button
              className="p-2 bg-[#ccc89b] rounded-full hover:bg-[#ccc89b]"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <GrEmoji />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-20 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer p-2 bg-[#ccc89b] rounded-full hover:bg-[#a39f74]">
              <IoAttachSharp />
            </label>
            <button
              onClick={handleSendMessage}
              className="bg-[#a39f74] text-white p-2 rounded-full hover:bg-[#ccc89b]"
            >
              <IoIosSend />
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default UserChat;
