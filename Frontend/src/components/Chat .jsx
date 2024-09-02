import React, { useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';

function Chat({ headerTitle, chatUsers, initialMessages, HeaderComponent }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {HeaderComponent && <HeaderComponent />}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{headerTitle}</h2>
          </div>
          <ul>
            {chatUsers.map((user, index) => (
              <li key={index} className="p-4 border-b hover:bg-gray-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="text-sm font-medium">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center p-2 border-b bg-white">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <h2 className="ml-3 text-xl font-semibold">{initialMessages[0]?.name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {initialMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`rounded p-2 ${msg.sent ? 'bg-[#a39f74] text-white' : 'bg-gray-200'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white border-t">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring focus:ring-[#a39f74] focus:ring-offset-0"
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <MdOutlineEmojiEmotions size={20} />
              </button>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <IoIosSend size={24} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2">
                  <EmojiPicker onEmojiClick={addEmoji} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
