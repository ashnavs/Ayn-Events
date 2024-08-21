

import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Message from '../../infrastructure/database/dbmodel/MessageModel';
import ChatModel from '../../infrastructure/database/dbmodel/chatModel';
import { uploadToS3 } from '../../utils/s3Uploader';
import { v4 as uuidv4 } from 'uuid';


const handleSocketEvents = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room
    socket.on('join_room', async (room) => {
      if (!mongoose.Types.ObjectId.isValid(room)) {
        console.error(`Invalid chat ID: ${room}`);
        return;
      }
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on('message', (message) => {
            console.log('Message received on server:', message);
            io.to(message.roomId).emit('message', message); // Broadcast to room
          });
      


    // Handle sending messages (text only, image only, or both)
    socket.on('sendMessage', async (data) => {
      try {
        console.log('Received message data:', data);
    
        if (data.content && data.content.trim()) {
          // Handle text message
          const message = new Message({
            chat: data.roomId,
            sender: data.sender,
            content: data.content,
            senderModel: data.senderModel,
            messageId: uuidv4(), // Adding unique messageId for each message
          });
    
          const savedMessage = await message.save();
          io.to(data.roomId).emit('receiveMessage', savedMessage);
          console.log('Message saved and sent:', savedMessage);
    
        } else if (data.fileBase64) {
          // Handle file uploads
          const buffer = Buffer.from(data.fileBase64, 'base64');
          const uniqueFileName = `${Date.now()}-${data.fileName}`;
          const file = {
            buffer,
            originalname: uniqueFileName,
            mimetype: data.fileType,
          };
    
          const { Location } = await uploadToS3(file);
          const newMessage = await Message.create({
            chat: data.roomId,
            sender: data.sender,
            senderModel: data.senderModel,
            fileUrl: Location,
            fileName: data.fileName,
            fileType: data.fileType,
            isFile: true,
            messageId: uuidv4(), // Adding unique messageId for each message
          });
    
          io.to(data.roomId).emit('receiveMessage', newMessage);
          console.log(`File uploaded and sent to room ${data.roomId}: ${data.fileName}`);
    
        } else {
          console.log('No content or file to send.');
          socket.emit('error', { message: 'Message content is empty.' });
        }
      } catch (error) {
        console.error('Error processing message:', error);
        socket.emit('error', { message: 'Error processing message' });
      }
    });
    
   
    
    

    // Handle chat requests
    socket.on('chatRequest', async ({ userId, vendorId }) => {
      console.log('Chat request received:', { userId, vendorId });
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

    // Handle accepting chat requests
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

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default handleSocketEvents;
