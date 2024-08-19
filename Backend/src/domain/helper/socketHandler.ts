import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Message from '../../infrastructure/database/dbmodel/MessageModel';
import ChatModel from '../../infrastructure/database/dbmodel/chatModel';
import { uploadToS3 } from '../../utils/s3Uploader';

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

    socket.on('message', (message) => {
      console.log('Message received on server:', message);
      io.to(message.roomId).emit('message', message); // Broadcast to room
    });

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

    // socket.on('sendMessage', async ({ roomId, userId, message, senderModel }) => {
    //   console.log('Received sendMessage:', { roomId, userId, message, senderModel });
    //   try {
    //     if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(userId) || !senderModel) {
    //       console.error('Invalid roomId, userId, or missing senderModel:', { roomId, userId, senderModel });
    //       return;
    //     }

    //     const newMessage = await Message.create({
    //       chat: roomId,
    //       sender: userId,
    //       senderModel,
    //       content: message,
    //     });

    //     io.to(roomId).emit('receiveMessage', newMessage);
    //     console.log(`Message sent to room ${roomId}: ${message}`);
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //   }
    // });

    socket.on('sendMessage', async ({ roomId, userId, message, senderModel }) => {
      try {
        const newMessage = await Message.create({
          chat: roomId,
          sender: userId,
          senderModel,
          content: message,
        });
    
        io.to(roomId).emit('receiveMessage', newMessage); // Emit to the room
        console.log(`Message sent to room ${roomId}: ${message}`);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

   

    // socket.on('uploadImage', async ({ roomId, userId, imageBase64, senderModel }) => {
    //   try {
    //     if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(userId) || !imageBase64) {
    //       throw new Error('Invalid input data');
    //     }

    //     const buffer = Buffer.from(imageBase64, 'base64');
    //     const file = {
    //       buffer,
    //       originalname: `${Date.now()}-image.jpg`,
    //       mimetype: 'image/jpeg', // Adjust as needed
    //     };

    //     const result = await uploadToS3(file);
    //     const imageUrl = result.Location;

    //     const newMessage = await Message.create({
    //       chat: roomId,
    //       sender: userId,
    //       content: imageUrl,
    //       senderModel,
    //       isImage: true,
    //     });

    //     io.to(roomId).emit('receiveMessage', newMessage);
    //     console.log(`Image uploaded and message sent to room ${roomId}`);
    //   } catch (error) {
    //     console.error('Error uploading image:', error);
    //   }
    // });

    
    
    
    

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default handleSocketEvents;
