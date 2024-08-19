import React, { useState, useEffect } from 'react';
import { useSocket } from '../../services/socketProvider';
import { useSelector } from 'react-redux';
import { selectVendor } from '../../features/vendor/vendorSlice';
import { selectUser } from '../../features/auth/authSlice';
import axiosInstanceVendor from '../../services/axiosInstanceVenndor';
import EmojiPicker from 'emoji-picker-react'
import { FaPaperPlane, FaSmile  } from 'react-icons/fa'; // Import send icon
import { GrEmoji } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";





const VendorChat = () => {
  const vendor = useSelector(selectVendor);
  const vendorId = vendor.vendor.id;
  const user = useSelector(selectUser);
  const userId = user.id;

  const { socket } = useSocket();
  const [chatRequests, setChatRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    if (socket && vendorId) {
      socket.emit('join_room', vendorId);
    }
  }, [socket, vendorId]);

  useEffect(() => {
    if (socket) {
      socket.on('chatRequest', (data) => {
        const requestData = { ...data, vendorId: vendor.vendor.id };
        if (!activeChats.find((chat) => chat.from === data.from)) {
          setChatRequests((prevRequests) => [...prevRequests, requestData]);
        }
      });

      // socket.on('receiveMessage', (message) => {
      //   console.log('Received message:', message);
  
      //   setMessagesByRoom((prevMessagesByRoom) => {
      //     const { chat } = message; // Assuming `chat` is the room ID in the message object
      //     const roomMessages = prevMessagesByRoom[chat] || [];
      //     return {
      //       ...prevMessagesByRoom,
      //       [chat]: [...roomMessages, message],
      //     };
      //   });
      // });

      return () => {
        socket.off('chatRequest');
        // socket.off('receiveMessage');
      };
    }
  }, [socket, vendor, selectedChat, activeChats]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        console.log('Received message:', message);
  
        if(message.senderModel !== "Vendor") {
          setMessagesByRoom((prevMessagesByRoom) => {
            const { chat } = message; // Assuming `chat` is the room ID in the message object
            const roomMessages = prevMessagesByRoom[chat] || [];
            return {
              ...prevMessagesByRoom,
              [chat]: [...roomMessages, message],
            };
          });
        }
      });
  
      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);
  
  const handleAcceptChat = (request) => {
    if (socket && userId) {
      const { roomId } = request;
      if (vendorId && roomId) {
        socket.emit('acceptChatRequest', { userId, vendorId, roomId });
        setActiveChats((prevChats) => [...prevChats, request]);
        setChatRequests((prevRequests) => prevRequests.filter((r) => r.from !== request.from));
        setSelectedChat(request);
        setMessagesByRoom((prevMessagesByRoom) => ({
          ...prevMessagesByRoom,
          [roomId]: [],
        }));
      } else {
        console.error('Vendor ID or Room ID is missing.');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedChat) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const fileData = {
          roomId: selectedChat._id,
          userId,
          imageBase64: base64String,
          senderModel: 'Vendor',
        };
        socket.emit('uploadImage', fileData);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSendMessage = (message) => {
  //   if (socket && selectedChat) {
  //     const { _id: roomId } = selectedChat;
  //     const senderModel = 'Vendor'; // Or 'User' based on the context
  
  //     if (roomId && userId && message) {
  //       socket.emit('sendMessage', { roomId, userId, message, senderModel });
        
  //       // Optimistically add the message to the UI
  //       setMessagesByRoom((prevMessagesByRoom) => {
  //         const roomMessages = prevMessagesByRoom[roomId] || [];
  //         return {
  //           ...prevMessagesByRoom,
  //           [roomId]: [...roomMessages, { sender: userId, content: message, senderModel: senderModel }],
  //         };
  //       });
  
  //       setMessageInput('');
  //       setShowEmojiPicker(false); 
  //     } else {
  //       console.error('Room ID, User ID, or Message is missing.');
  //     }
  //   } else {
  //     console.error('Selected chat is not set.');
  //   }
  // };

  //file
  const handleSendMessage = async (message) => {
    if (socket && selectedChat) {
      const { _id: roomId } = selectedChat;
      const senderModel = 'Vendor'; // Or 'User' based on the context
  
      if (roomId && userId) {
        // Create the message object
        const messageData = {
          roomId,
          userId,
          message,
          senderModel,
          imageBase64: selectedImage ? await convertImageToBase64(selectedImage) : null, // Convert image to Base64
        };
  
        socket.emit('sendMessage', messageData);
  
        // Optimistically add the message to the UI
        setMessagesByRoom((prevMessagesByRoom) => {
          const roomMessages = prevMessagesByRoom[roomId] || [];
          return {
            ...prevMessagesByRoom,
            [roomId]: [...roomMessages, { ...messageData, content: messageData.imageBase64 ? URL.createObjectURL(new Blob([selectedImage])) : message }],
          };
        });
  
        setMessageInput('');
        setShowEmojiPicker(false);
        setSelectedImage(null); // Clear selected image after sending
      } else {
        console.error('Room ID or User ID is missing.');
      }
    } else {
      console.error('Selected chat is not set.');
    }
  };
  
  // Helper function to convert image to Base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  

  const handleSelectedChat = async (chatId) => {
    try {
      const response = await axiosInstanceVendor.get(`/messages/${chatId}`);
      const messages = response.data;
  
      setMessagesByRoom((prevMessagesByRoom) => ({
        ...prevMessagesByRoom,
        [chatId]: messages,
      }));
  
      const chat = activeChats.find(chat => chat._id === chatId);
      if (chat) {
        setSelectedChat(chat);
        socket.emit('join_room', chatId);  // Make sure vendor joins the correct chat room
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/active-chats/${vendorId}`);
        if (Array.isArray(response.data)) {
          setActiveChats(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setActiveChats([]); 
        }
      } catch (error) {
        console.error("Error fetching active chats:", error);
        setActiveChats([]); 
      }
    };

    fetchActiveChats();
  }, [vendorId]);

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
            activeChats.filter(chat => chat.is_accepted === 'accepted').map((chat) => (
              <div
                key={chat._id}
                className={`p-3 rounded-lg mb-3 cursor-pointer ${
                  selectedChat?._id === chat._id ? 'bg-blue-100' : 'bg-gray-50'
                }`}
                onClick={() => handleSelectedChat(chat._id)}
              >
                <p>{chat.users.find((u) => u._id !== vendorId)?.name || "Unknown User"}</p>
              </div>
            ))
          )}
        </div>

        {/* Chat Requests */}
        <h3 className="font-semibold">Chat Requests</h3>
        {chatRequests.length === 0 ? (
          <p className="text-gray-500">No chat requests.</p>
        ) : (
          chatRequests.map((request) => (
            <div key={request.roomId} className="bg-white p-3 rounded-lg shadow mb-3">
              <p className="font-semibold">User ID: {request.from}</p>
              <div className="flex justify-between mt-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleAcceptChat(request)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => {/* handle decline logic */}}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Messages Display */}
        <div className="flex-grow overflow-y-auto p-4 ">
          {selectedChat ? (
            messagesByRoom[selectedChat._id]?.length > 0 ? (
              messagesByRoom[selectedChat._id].map((msg) => (
                <div
                  key={msg._id} // Ensure key is unique
                  className={`mb-2 p-2 rounded-lg max-w-xs ${
                    msg.senderModel === 'Vendor' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'
                  }`}
                >
                  {msg.content}
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
      {selectedChat && (
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
            id="imageUpload"
          />
<label htmlFor="imageUpload" className="cursor-pointer p-2 bg-[#ccc89b] rounded-full hover:bg-[#a39f74]">
<IoAttachSharp />

</label>

            <button
              onClick={() => handleSendMessage(messageInput)}
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


export default VendorChat;