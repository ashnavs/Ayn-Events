import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Message from '../../infrastructure/database/dbmodel/MessageModel';
import ChatModel from '../../infrastructure/database/dbmodel/chatModel';
import { uploadToS3 } from '../../utils/s3Uploader';
import { v4 as uuidv4 } from 'uuid';



const handleSocketEvents = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    


    socket.on('join_room', async (room) => {
      if (!mongoose.Types.ObjectId.isValid(room)) {
        console.error(`Invalid chat ID: ${room}`);
        return;
      }
      
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });



    socket.on('sendMessage', async (data) => {
      try {
        console.log('Received message data:', data);
    
        let savedMessage;
    
        if (data.content && data.content.trim()) {
          const message = new Message({
            chat: data.roomId,
            sender: data.sender,
            content: data.content,
            senderModel: data.senderModel,
            messageId: uuidv4(),
          });
    
          savedMessage = await message.save();
        } else if (data.fileBase64) {
          const buffer = Buffer.from(data.fileBase64, 'base64');
          const uniqueFileName = `${Date.now()}-${data.fileName}`;
          const file = {
            buffer,
            originalname: uniqueFileName,
            mimetype: data.fileType,
          };

         
        
    
          const { Location } = await uploadToS3(file);
          const message = new Message({
            chat: data.roomId,
            sender: data.sender,
            senderModel: data.senderModel,
            fileUrl: Location,
            fileName: data.fileName,
            fileType: data.fileType,
            isFile: true,
            messageId: uuidv4(),
          });
    
          savedMessage = await message.save();
        } else if (data.audio) {
          console.log('Audio data received:', data.audio);
const buffer = Buffer.from(data.audio, 'base64');
console.log('Buffer created:', buffer);

          const uniqueFileName = `${Date.now()}-${data.voiceFileName}`;
          const file = {
            buffer,
            originalname: uniqueFileName,
            mimetype: data.voiceFileType || 'audio/webm',
        };

          console.log('file:',file)
    
          const { Location } = await uploadToS3(file);
          const message = new Message({
            chat: data.roomId,
            sender: data.sender,
            senderModel: data.senderModel,
            fileUrl: Location,
            fileName: data.voiceFileName,
            fileType: data.voiceFileType,
            isFile: true,
            isVoice: true, 
            messageId: uuidv4(),
          });
    
          savedMessage = await message.save();

          
        } else {
          console.log('No content or file to send.');
          socket.emit('error', { message: 'Message content is empty.' });
          return;
        }
    

        io.to(data.roomId).emit('receiveMessage', savedMessage);
        console.log('Message saved and sent:', savedMessage);

    const unreadCounts = await Message.countDocuments({
      senderModel:data.senderModel,
      read: false,
    });


 
    if (data.senderModel === 'User') {
      console.log("Calculated unread countu:", unreadCounts);
      io.to(data.roomId).emit('unreadCount', { unreadCount: unreadCounts, recipient: 'Vendor' });
    } else if (data.senderModel === 'Vendor') {
      console.log("Calculated unread countv:", unreadCounts);
      io.to(data.roomId).emit('unreadCount', { unreadCount: unreadCounts, recipient: 'User' });
    }
      } catch (error) {
        console.error('Error processing message:', error);
        socket.emit('error', { message: 'Error processing message' });
      }
    });


socket.on('deleteMessage', async (messageId) => {
  try {
    console.log('Received delete request for message ID:', messageId);


    const deletedMessage = await Message.findByIdAndUpdate(
      messageId,
      { deleted: true },
      { new: true }
    );

    if (!deletedMessage) {
      console.error('Message not found:', messageId);
      socket.emit('error', { message: 'Message not found' });
      return;
    }

    if (deletedMessage.chat) {
      const chatId = deletedMessage.chat.toString();  
      io.to(chatId).emit('messageDeleted', { messageId, deleted: true }); 
      console.log('Message marked as deleted and notification sent:', {messageId });
    } else {
      console.error('Message or its chat is undefined');
    }
  } catch (error) {
    console.error('Error marking message as deleted:', error);
    socket.emit('error', { message: 'Error deleting message' });
  }
});

    

    


    socket.on('chatRequest', async ({ userId, vendorId, userName }) => {
      console.log('Chat request received:', { userId, vendorId, userName });
      try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(vendorId)) {
          console.error('Invalid userId or vendorId:', { userId, vendorId });
          return;
        }

        const newChat = await ChatModel.create({
          users: [userId, vendorId],
          is_accepted: 'pending',
          is_blocked: false,
        });

        if (!newChat) {
          console.error('Failed to create chat room.');
          return;
        }

        const roomId = newChat._id.toString();
        socket.to(vendorId).emit('chatRequest', {
          from: userId,
          roomId,
          userName,
          message: 'Chat request received',
        });

        socket.emit('chatRequestSent', {
          to: vendorId,
          roomId,
          message: 'Chat request sent',
        });

        console.log(`Chat request sent from ${userId} to ${vendorId} for room ${roomId}`);
      } catch (error) {
        console.error('Error sending chat request:', error);
      }
    });


    socket.on('acceptChatRequest', async ({ userId, vendorId, roomId }) => {
      console.log('Accept chat request received:', { userId, vendorId, roomId });
      try {
        const chat = await ChatModel.findById(roomId);
        if (!chat) {
          throw new Error(`Chat not found: ${roomId}`);
        }

        chat.is_accepted = 'accepted';
        await chat.save();

        socket.join(roomId);
        io.to(userId).emit('chatRequestAccepted', { roomId, userId, vendorId });
        io.to(vendorId).emit('chatRequestAccepted', { roomId, userId, vendorId });

        console.log(`Chat request accepted for room ${roomId}`);
      } catch (error) {
        console.error('Error accepting chat request:', error);
        socket.emit('error', { message: 'Error accepting chat request' });
      }
    });


    socket.on('messageRead', async ({ roomId, userId }) => {
      try {
        await Message.updateMany(
          { chat: roomId, sender: { $ne: userId }, read: false },
          { $set: { read: true } }
        );
    
        const updatedMessages = await Message.find({ chat: roomId });
        io.to(roomId).emit('messagesUpdated', updatedMessages);
    
        const unreadCounts = await Message.countDocuments({
          chat: roomId,
          sender: { $ne: userId },
          read: false,
        });
        io.to(userId).emit('unreadCount', { roomId, unreadCounts });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });
    


    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('typing', data);
    });


    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default handleSocketEvents;

