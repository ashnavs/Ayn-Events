import React, { useState, useEffect, useRef } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { useSocket } from '../../services/socketProvider';
import Header from '../../components/Header';
import EmojiPicker from 'emoji-picker-react';
import { GrEmoji } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { IoAttachSharp } from "react-icons/io5";
import { format } from 'date-fns';
import { MdDone, MdDoneAll } from 'react-icons/md';
import { PiDotsThreeCircleVerticalBold } from "react-icons/pi";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { resetUnreadCount } from '../../features/chat/chatSlice';


const UserChat = () => {
  const dispatch = useDispatch()
  const [activeChats, setActiveChats] = useState([]);
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); 
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false); 
  const [mediaRecorder, setMediaRecorder] = useState(null); 
  const [audioChunks, setAudioChunks] = useState([]); 
  const [dropdownVisible, setDropdownVisible] = useState({}); 
  const [unreadCounts, setUnreadCounts] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [message, setMessage] = useState('');



  

  

  const { socket } = useSocket(); 
  const user = useSelector(selectUser);
  const userId = user.id;

  const messagesEndRef = useRef(null);



  useEffect(() => {
    if (socket) {
      socket.on('typing', (data) => {
        if (data.roomId === selectedRoom) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });
  
      return () => {
        socket.off('typing');
      };
    }
  }, [socket, selectedRoom]);

   // Fetch active chats when userId changes
   useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        const response = await axiosInstanceUser.get(`/active-chats/${userId}`);
        const sortedChats = response.data.sort((a, b) => {
          const latestMessageA = a.latestMessage ? new Date(a.latestMessage.createdAt) : new Date(0);
          const latestMessageB = b.latestMessage ? new Date(b.latestMessage.createdAt) : new Date(0);
          return latestMessageB - latestMessageA;
        });
        console.log('sortedChats:',sortedChats)
        setActiveChats(sortedChats);

      } catch (error) {
        console.error('Error fetching active chats:', error);
      }
    };

    fetchActiveChats();
  }, [userId]);

  useEffect(() => {
    if (socket && selectedRoom && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit('typing', { roomId: selectedRoom, userId: userId });
      }, 500); 
  
      return () => clearTimeout(typingTimeout); 
    }
  }, [messageInput, socket, selectedRoom, userId]);
  


  useEffect(() => {
    if (socket) {
      socket.on('unreadCount', (data) => {
        setUnreadCounts(prevCounts => ({
          ...prevCounts,
          [data.roomId]: data.unreadCount,
        }));
      });
  
      return () => {
        socket.off('unreadCount');
      };
    }
  }, [socket]);
  


  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      console.log('Received message on frontend:', newMessage);
  
     
      setMessagesByRoom(prevMessagesByRoom => {
        const roomMessages = prevMessagesByRoom[newMessage.chat] || [];
        return {
          ...prevMessagesByRoom,
          [newMessage.chat]: [...roomMessages, newMessage],
        };
      });

      if (newMessage.senderModel === 'Vendor') {
        setUnreadCounts(prevCounts => {
          const currentCount = prevCounts[newMessage.chat] || 0;
          console.log('Updating unread count for room:', newMessage.chat, 'Current count:', currentCount + 1);
          return { ...prevCounts, [newMessage.chat]: currentCount + 1 };
        });
      }
  
    
      setActiveChats(prevChats => {
        const updatedChats = prevChats.map(chat => {
          if (chat._id === newMessage.chat) {
            return { ...chat, latestMessage: newMessage,unreadCount: unreadCounts[chat._id] || 0 };
          }
          return chat;
        });
  

        return updatedChats.sort((a, b) => {
          const latestMessageA = a.latestMessage ? new Date(a.latestMessage.createdAt) : new Date(0);
          const latestMessageB = b.latestMessage ? new Date(b.latestMessage.createdAt) : new Date(0);
          return latestMessageB - latestMessageA;
        });
      });
    };
  
    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
  
      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket]);




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


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom(); 
  }, [messagesByRoom, selectedRoom]);


  useEffect(() => {
    if (socket && selectedRoom) {
      socket.on('messageDeleted', (data) => {
        const { messageId } = data;
  
        setMessagesByRoom((prevMessagesByRoom) => {
          const roomMessages = prevMessagesByRoom[selectedRoom] || [];  
          const updatedMessages = roomMessages.map((msg) => {
            if (msg._id === messageId) {
              return { ...msg, deleted: true }; 
            }
            return msg;
          });
  
          return {
            ...prevMessagesByRoom,
            [selectedRoom]: updatedMessages,
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
  }, [socket, selectedRoom]);
  
  
  
  
  

  const handleSendVoiceMessage = async () => {
    if (audioChunks.length > 0) {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const file = new File([blob], `voice_message_${Date.now()}.webm`, { type: blob.type }); 
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64AudioMessage = reader.result.split(',')[1];

            socket.emit('sendMessage', {
                roomId: selectedRoom,
                sender: userId,
                senderModel: 'User',
                audio: base64AudioMessage,
                voiceFileName: file.name,
                voiceFileType: file.type,
            });
        };

        reader.readAsDataURL(file);
    }
};


const playAudio = (voiceFileUrl) => {
  const audio = new Audio(voiceFileUrl);
  audio.play();
};

  

  //newmshssned
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
            console.log('File data:', fileData);
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
          timestamp: new Date(),
          replyTo: replyToMessage ? replyToMessage._id : null, 
          ...fileData,
        };
  
        try {
          console.log('Sending message data:', messageData);
          socket.emit('sendMessage', messageData);
  

          setMessageInput('');
          setSelectedFile(null);
          setFilePreview(null);
          setShowEmojiPicker(false);
          setReplyToMessage(null); 
          document.getElementById('fileUpload').value = '';
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
  
  

  useEffect(() => {
    if (socket) {

      socket.on('messageSent', (messageId) => {
        setMessagesByRoom(prevMessagesByRoom => {
          const roomMessages = prevMessagesByRoom[selectedRoom].map(msg =>
            msg._id === messageId ? { ...msg, isSent: true } : msg
          );
          return { ...prevMessagesByRoom, [selectedRoom]: roomMessages };
        });
      });
  
  
      socket.on('messageDelivered', (messageId) => {
        setMessagesByRoom(prevMessagesByRoom => {
          const roomMessages = prevMessagesByRoom[selectedRoom].map(msg =>
            msg._id === messageId ? { ...msg, isDelivered: true } : msg
          );
          return { ...prevMessagesByRoom, [selectedRoom]: roomMessages };
        });
      });
  

      socket.on('messageRead', (messageId) => {
        setMessagesByRoom(prevMessagesByRoom => {
          const roomMessages = (prevMessagesByRoom[selectedRoom] || []).map(msg =>
            msg._id === messageId ? { ...msg, isRead: true } : msg
          );
          return { ...prevMessagesByRoom, [selectedRoom]: roomMessages };
        });
      });
  
      return () => {
        socket.off('messageSent');
        socket.off('messageDelivered');
        socket.off('messageRead');
      };
    }
  }, [socket, selectedRoom]);
  
  

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); 
      reader.onerror = (error) => reject(error);
    });
  };

  const getMessageStatusIcon = (message) => {
    if (message.senderModel === 'User') {
      if (!message.isSent) {
        return <MdDone />;
      } else if (message.isDelivered && !message.isRead) {
        return <MdDoneAll />; 
      } else if (message.isRead) {
        return <MdDoneAll style={{ color: 'blue' }} />; 
      }
    }
    return null; 
  };

  
  

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);


      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    if (selectedRoom) {
      const fetchMessagesForRoom = async () => {
        try {
          const response = await axiosInstanceUser.get(`/messages/${selectedRoom}`);
          console.log('Fetched messages:', response.data);

          const messages = response.data.messages || [];

          setMessagesByRoom(prevMessagesByRoom => ({
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

  useEffect(() => {
    if (selectedRoom && socket) {
      socket.emit('messageRead', { roomId: selectedRoom, userId });
    }
  }, [selectedRoom, socket, userId]);
  

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);

    setUnreadCounts(prevCounts => ({ ...prevCounts, [roomId]: 0}));

  

    setActiveChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat._id === roomId) {
          return { ...chat, isActive: true };
        }
        return chat;
      });
      dispatch(resetUnreadCount());
      return updatedChats.sort((a, b) => {
        const latestMessageA = a.latestMessage ? new Date(a.latestMessage.createdAt) : new Date(0);
        const latestMessageB = b.latestMessage ? new Date(b.latestMessage.createdAt) : new Date(0);
        return latestMessageB - latestMessageA;
      });
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
          const audioBlob = new Blob(newAudioChunks, { type: 'audio/wav' });
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
  
  
  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', messageId);
  };

  

  const handleEmojiClick = (emojiObject) => {
    setMessageInput(prevInput => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleDropdown = (messageId) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId],
    }));
  };
  const handleReply = (message) => {
    setReplyToMessage(message);
  };
  



  return (
    <div>
      <Header />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar for Active Chats */}
        <div className="w-1/4 border-r border-gray-200 p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Active Chats</h3>
          {activeChats.length === 0 ? (
            <p className="text-gray-500">No active chats.</p>
          ) : (
            activeChats
              .sort((a, b) => new Date(b.latestMessage?.createdAt) - new Date(a.latestMessage?.createdAt))
              .map((chat) => (
                <div
                  key={chat._id}
                  className={`relative p-3 rounded-lg mb-3 cursor-pointer ${
                    selectedRoom === chat._id ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                  onClick={() => handleRoomSelect(chat._id)}
                >
                  <p>{chat.users.find((u) => u._id !== userId)?.name || "Unknown User"}</p>
                  <p className="text-gray-500 text-sm">
                    {chat.latestMessage && chat.latestMessage.content ? chat.latestMessage.content : 'No messages yet'}
                  </p>
          {unreadCounts[chat._id] > 0 && chat.latestMessage?.senderModel === 'Vendor' && (
            <span className="absolute top-4 right-4 bg-[#a39f74] text-white text-xs px-2 py-1 rounded-full unread-count">
              {unreadCounts[chat._id]}
            </span>
          )}

                </div>
              ))
          )}
          </div>
        </div>
  
        {/* Chat Area */}
        <div className="flex-grow flex flex-col">
          {/* Selected Chat Header */}
          {selectedRoom && (
            <div className="bg-white border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold">
                {activeChats.find(chat => chat._id === selectedRoom)?.users.find(u => u._id !== userId)?.name || "Unknown User"}
              </h3>
              <div className="h-2">
                {typing && <p className="text-xs">Typing...</p>}
              </div>
            </div>
          )}
  
         


<div className="flex-grow overflow-y-auto p-4">
  {selectedRoom ? (
    <>
      {messagesByRoom[selectedRoom] && Array.isArray(messagesByRoom[selectedRoom]) ? (
        messagesByRoom[selectedRoom].length > 0 ? (
          messagesByRoom[selectedRoom].map((msg) => (
            <div
              key={msg._id}
              
              className={`relative mb-2 p-2 rounded-lg max-w-fit ${
                msg.senderModel === 'User' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'
              }`}
            >
              {/* Dropdown Arrow */}
              {!msg.deleted && (
                <div className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10">
                  <PiDotsThreeCircleVerticalBold
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => toggleDropdown(msg._id)}
                  />
                  {dropdownVisible[msg._id] && (
                    <div className="absolute left-[-110px] top-0 mt-2 bg-white shadow-lg rounded-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        onClick={() => deleteMessage(msg._id)}
                      >
                        Delete
                      </button>
                      <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      onClick={() => handleReply(message)}>Reply</button>
                    </div>
                  )}
                </div>
              )}

              {/* Message Content */}
              {msg.deleted ? (
                <div className="text-gray-400 italic">This message was deleted</div>
              ) : (
                <>
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
                  ) : msg.fileUrl && msg.fileType.startsWith('audio/') ? (
                    <audio
                      controls
                      src={msg.fileUrl}
                      className="mt-2 max-w-full rounded-lg"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : msg.fileUrl ? (
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName}
                      className="mt-2 max-w-xs h-auto rounded-lg"
                      style={{ maxHeight: '300px' }}
                    />
                  ) : null}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{msg.createdAt ? format(new Date(msg.createdAt), 'p') : ''}</span>
                    <span className="text-gray-400">{getMessageStatusIcon(msg)}</span>
                  </div>
                </>
              )}
            </div>
            
          ))
        ) : (
          <p>No messages yet</p>
        )
      ) : (
        <p>No messages yet.</p>
      )}
       <div key={message._id} className="message">
    {message.replyTo && (
      <div className="reply-message">
        <p>Replying to: {message.replyTo.content}</p>
      </div>
    )}
    <p>{message.content}</p>
  </div>
    </>
  ) : (
    <p>Select a chat to start messaging.</p>
  )}
</div>

{replyToMessage && (
  <div className="reply-preview">
    <p>Replying to: {replyToMessage.content}</p>
    <button onClick={() => setReplyToMessage(null)}>Cancel</button>
  </div>
)}




          {typing && <p className="text-xs">Typing...</p>}
  
          {/* Message Input */}
          {selectedRoom && (
            <div className="p-4 border-t border-gray-200 flex items-center space-x-2 relative">
              <button
                className="p-2 bg-[#a39f74] rounded-full hover:bg-[#ccc89b] text-white"
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
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a39f74]"
              />
              <input
                type="file"
                accept="image/*"
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
                className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-[#a39f74] hover:bg-[#ccc89b] text-white'} hover:bg-[#a39f74]`}
              >
                 {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
  
              <button
                onClick={handleSendMessage}
                className="bg-[#a39f74] text-white p-2 rounded-full hover:bg-[#ccc89b]"
              >
                <IoIosSend />
              </button>
              {filePreview && (
                <div className="absolute bottom-16 right-16 bg-white p-2 border rounded-lg shadow-md">
                  <img src={filePreview} alt="Preview" className="max-w-xs max-h-32" />
                  <button
                    onClick={() => setFilePreview(null)}
                    className="text-red-500 mt-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default UserChat;



