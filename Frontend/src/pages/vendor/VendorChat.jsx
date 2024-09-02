import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../services/socketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { selectVendor, setChatRequestCount } from '../../features/vendor/vendorSlice';
import { resetUnreadCount } from '../../features/chat/chatSlice';
import { selectUser } from '../../features/auth/authSlice';
import axiosInstanceVendor from '../../services/axiosInstanceVenndor';
import EmojiPicker from 'emoji-picker-react';
import { GrEmoji } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";
import VendorHeader from '../../components/VendorHeader';
import { format } from 'date-fns';
import { PiDotsThreeCircleVerticalBold } from "react-icons/pi";
import { FaMicrophone, FaStop } from "react-icons/fa";





const VendorChat = () => {
  const vendor = useSelector(selectVendor);
  const vendorId = vendor.vendor.id;
  const user = useSelector(selectUser);
  const dispatch = useDispatch()

  const messagesEndRef = useRef(null);

  const { socket } = useSocket();
  const [chatRequests, setChatRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});




  useEffect(() => {
    if (socket && vendorId) {
      socket.emit('join_room', vendorId);
    }
  }, [socket, vendorId]);

  useEffect(() => {
    if (socket && selectedChat && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit('typing', { roomId: selectedChat._id, userId: vendorId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, selectedChat, vendorId]);
  console.log("activeChats", activeChats)

  useEffect(() => {
    if (socket) {
      socket.on('typing', (data) => {
        if (data.roomId === selectedChat?._id) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000); 
        }
      });

      return () => {
        socket.off('typing');
      };
    }
  }, [socket, selectedChat]);


  useEffect(() => {
    if (socket) {
      socket.on('chatRequest', (data) => {
        const requestData = { ...data, vendorId: vendor.vendor.id };
        console.log(requestData)
        if (!activeChats.find((chat) => chat.from === data.from)) {
          setChatRequests((prevRequests) => [...prevRequests, requestData]);
          dispatch(setChatRequestCount(chatRequests.length + 1));
        }
      });

      return () => {
        socket.off('chatRequest');
      };
    }
  }, [socket, vendor, selectedChat, activeChats, dispatch, chatRequests.length]);


  useEffect(() => {
    if (socket && selectedChat) {
      socket.on('receiveMessage', (message) => {
        console.log('Received message:', message);

  
        if (message.chat === selectedChat._id) {
          setMessagesByRoom((prevMessagesByRoom) => {
            const roomMessages = prevMessagesByRoom[selectedChat._id] || [];
            return {
              ...prevMessagesByRoom,
              [selectedChat._id]: [...roomMessages, message],
            };
          });
        }

        if (message.senderModel === 'User') {
          setUnreadCounts(prevCounts => {
            const currentCount = prevCounts[message.chat] || 0;
            return { ...prevCounts, [message.chat]: currentCount + 1 };
          });

        }


        setActiveChats((prevChats) => {
          const updatedChats = prevChats.map(chat => {
            if (chat._id === message.chat) {
              return {
                ...chat,
                latestMessage: message,
              };
            }
            return chat;
          });

 
          return updatedChats.sort((a, b) => {
            const latestMessageA = a.latestMessage?.createdAt || 0;
            const latestMessageB = b.latestMessage?.createdAt || 0;
            return new Date(latestMessageB) - new Date(latestMessageA);
          });
        });
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, selectedChat]);



useEffect(() => {
  if (socket && selectedChat) {
    socket.on('messageDeleted', (data) => {
      const { messageId } = data;

      setMessagesByRoom((prevMessagesByRoom) => {
        const roomMessages = prevMessagesByRoom[selectedChat._id] || [];
        const updatedMessages = roomMessages.map((msg) => {
          if (msg._id === messageId) {
            return { ...msg, deleted: true }; 
          }
          return msg;
        });

        return {
          ...prevMessagesByRoom,
          [selectedChat._id]: updatedMessages,
        };
      });

  
      setDropdownVisible((prevState) => ({
        ...prevState,
        [messageId]: false,
      }));
    });

    return () => {
      socket.off('messageDeleted');
    };
  }
}, [socket, selectedChat]);

  
  




  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (selectedChat && messagesByRoom[selectedChat._id]) {
      scrollToBottom();
    }
  }, [messagesByRoom[selectedChat?._id]]);



  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', messageId);
  };


  const handleAcceptChat = (request) => {
    if (socket) {
      const { roomId } = request;
      if (vendorId && roomId) {
        socket.emit('acceptChatRequest', { vendorId, roomId });
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

  const handleSendVoiceMessage = (audioBase64) => {
    socket.emit('sendMessage', {
      roomId: selectedChat._id,  
      sender: vendorId,
      senderModel: 'Vendor',
      audio: audioBase64,
      voiceFileName: `voice_message_${Date.now()}.webm`,
      voiceFileType: 'audio/webm',
    });
  };


  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        const newAudioChunks = [];
        setAudioChunks(newAudioChunks);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            newAudioChunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(newAudioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioBase64 = reader.result.split(',')[1];  
            handleSendVoiceMessage(audioBase64);  
          };
          reader.readAsDataURL(audioBlob);
        };

        recorder.start();
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };


  const handleSendMessage = async () => {
    if (socket && selectedChat) {
      const { _id: roomId } = selectedChat;
      const sender = vendorId;
      const senderModel = 'Vendor';

      if (roomId && sender) {
        let fileBase64 = null;
        let fileUrl = null;
        let fileName = null;

        if (selectedImage) {
          fileBase64 = await convertImageToBase64(selectedImage);
          fileUrl = URL.createObjectURL(selectedImage); 
          fileName = selectedImage.name;


          setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
        }

        const messageData = {
          roomId,
          sender,
          content: messageInput.trim(),
          senderModel,
          fileBase64,
          fileUrl,
          fileName,
          fileType: selectedImage?.type,
          createdAt: new Date().toISOString(),
        };

        try {
          socket.emit('sendMessage', messageData);
          setMessageInput('');
          setShowEmojiPicker(false);
          setSelectedImage(null);
          setShowModal(false);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        console.error('Room ID or Vendor ID is missing.');
      }
    } else {
      console.error('Socket connection or selected chat is not set.');
    }
  };


  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); 
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
        socket.emit('join_room', chatId);

        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [chatId]: 0,
        }));

        

        
      }
      dispatch(resetUnreadCount());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };




  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/active-chats/${vendorId}`);
        if (Array.isArray(response.data)) {
          const chats = response.data;

          // Sort chats by latest message timestamp
          chats.sort((a, b) => {
            const latestMessageA = a.latestMessage?.createdAt || 0;
            const latestMessageB = b.latestMessage?.createdAt || 0;
            return new Date(latestMessageB) - new Date(latestMessageA);
          });

          setActiveChats(chats);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the file object
      e.target.value = null; // Clear the file input value
    }
  };

  const handleDeclineChat = (request) => {
    if (socket) {
      const { roomId } = request;
      socket.emit('declineChatRequest', { vendorId, roomId });
      setChatRequests((prevRequests) => prevRequests.filter((r) => r.roomId !== request.roomId));
    } else {
      console.error('User ID is missing.');
    }
  };


  const toggleDropdown = (messageId) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId],
    }));
  };


  return (
    <div>
      <VendorHeader />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar for Active Chats */}
        <div className="w-1/4 border-r border-gray-200 p-4 bg-white">



          <h2 className="text-xl font-bold mb-4">Chats</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Active Chats</h3>
            {activeChats.length === 0 ? (
              <p className="text-gray-500">No active chats.</p>
            ) : (
              activeChats.map((chat) => {
                const unreadCount = unreadCounts[chat._id] || 0;
                return (
                  <div
                    key={chat._id}
                    className={`relative p-3 rounded-lg mb-3 cursor-pointer ${selectedChat?._id === chat._id ? 'bg-blue-100' : 'bg-gray-50'
                      }`}
                    onClick={() => handleSelectedChat(chat._id)}
                  >
                    <p>{chat.users.find((u) => u._id !== vendorId)?.name || 'Chat'}</p>
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 bg-[#a39f74] text-white text-xs px-2 py-1 rounded-full unread-count z-10">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                );
              })

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
                    onClick={() => {/* handle decline logic */ }}
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
          {/* Selected Chat Header */}
          {selectedChat && (
            <div className="bg-white border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold">
                {(() => {
                  const chat = activeChats.find(chat => chat._id === selectedChat._id);
                  console.log("Found chat:", chat); // Log the found chat to see if it exists
                  return chat?.users?.[0]?.name || "Unknown User";
                })()}
              </h3>
              <div className="h-2"> {/* Fixed height for the typing indicator */}
                {typing && <p className="text-xs">Typing...</p>}
              </div>
            </div>
          )}







          {/* Messages List */}
          <div className="flex-grow overflow-y-auto p-4">
            {selectedChat ? (
              <>
                {(messagesByRoom[selectedChat._id] || []).map(msg => (
                  (msg.content || msg.fileUrl) && (
                    <div
                      key={msg._id}

                      className={`mb-2 p-2 rounded-lg min-w-28 w-fit  ${msg.senderModel === 'Vendor' ? 'ml-auto bg-[#ccc89b]' : 'mr-auto bg-gray-200'}`}
                    >
                      <div className="relative">
          
              {(msg.senderModel === 'Vendor' || msg.senderModel === 'User') && (
                <div className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10">
                  <PiDotsThreeCircleVerticalBold
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => toggleDropdown(msg._id)}
                  />
                  {dropdownVisible[msg._id] && (
                    <div className="absolute left-0 top-0 mt-6 bg-white shadow-lg rounded-lg z-10">
                      <button
                            className="delete-button block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            onClick={() => deleteMessage(msg._id)}
                            style={{ display: dropdownVisible[msg._id] ? 'block' : 'none' }}
                          >
                            Delete
                          </button>
                    </div>
                  )}
                </div>
              )}


{msg.deleted === true ? (
        <span className="deleted-message text-gray-500 italic">This message was deleted</span>
      ) : (
        <>
                        {msg.isVoice ? (
                          <audio controls src={msg.fileUrl}>
                            Your browser does not support the audio element.
                          </audio>

                        ) : (
                          <p>{msg.content}</p>
                        )}
                        {msg.fileUrl && msg.fileType.startsWith('video/') && (
                          <video
                            controls
                            src={msg.fileUrl}
                            className="mt-2 max-w-full h-auto rounded-lg"
                            style={{ maxHeight: '300px' }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {msg.fileUrl && msg.fileType === 'application/pdf' && (
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Open PDF
                          </a>
                        )}
                        {msg.fileUrl && msg.fileType.startsWith('audio/') && (
                          <audio
                            controls
                            src={msg.fileUrl}
                            className="mt-2 max-w-full h-auto rounded-lg"
                          // style={{ maxHeight: '300px' }}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        )}
                        {msg.fileUrl && msg.fileType.startsWith('image/') && (
                          <img
                            src={msg.fileUrl}
                            alt="Sent file"
                            className="mt-2 max-w-xs h-auto rounded-lg"
                            style={{ maxHeight: '300px' }}
                          />
                        )}
                        {msg.createdAt && (
                          <p className={`text-xs ${msg.senderModel === 'Vendor' ? 'text-white' : 'text-gray-500'} mt-1 absolute bottom-0 right-0`}>
                            {format(new Date(msg.createdAt), 'h:mm a')}
                          </p>
                        )}
                         </>
      )}
                        {/* <button onClick={() => deleteMessage(msg._id)}>Delete</button> */}
                      </div>

                    </div>
                  )
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <p className="text-gray-500">Select a chat to view messages.</p>
            )}
          </div>

          {typing && <p className="text-xs">Typing...</p>}

          {/* Message Input */}
          {selectedChat && (
            <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
              <button
                className="p-2 bg-[#a39f74] rounded-full  hover:bg-[#ccc89b] text-white"
                onClick={() => setShowEmojiPicker(prev => !prev)}
              >
                <GrEmoji />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-20 z-10 ">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a39f74]"
              />
              <input
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer p-2 bg-[#a39f74] rounded-full hover:bg-[#ccc89b] text-white">
                <IoAttachSharp />
              </label>
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="p-2 bg-[#a39f74] text-white rounded-full hover:bg-[#ccc89b]"
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
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
    </div>
  );


};


export default VendorChat;
