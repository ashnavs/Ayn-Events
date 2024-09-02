"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/MessageModel"));
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/chatModel"));
const s3Uploader_1 = require("../../utils/s3Uploader");
const uuid_1 = require("uuid");
const handleSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on('join_room', (room) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(room)) {
                console.error(`Invalid chat ID: ${room}`);
                return;
            }
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        }));
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log('Received message data:', data);
                let savedMessage;
                if (data.content && data.content.trim()) {
                    const message = new MessageModel_1.default({
                        chat: data.roomId,
                        sender: data.sender,
                        content: data.content,
                        senderModel: data.senderModel,
                        messageId: (0, uuid_1.v4)(),
                    });
                    savedMessage = yield message.save();
                }
                else if (data.fileBase64) {
                    const buffer = Buffer.from(data.fileBase64, 'base64');
                    const uniqueFileName = `${Date.now()}-${data.fileName}`;
                    const file = {
                        buffer,
                        originalname: uniqueFileName,
                        mimetype: data.fileType,
                    };
                    const { Location } = yield (0, s3Uploader_1.uploadToS3)(file);
                    const message = new MessageModel_1.default({
                        chat: data.roomId,
                        sender: data.sender,
                        senderModel: data.senderModel,
                        fileUrl: Location,
                        fileName: data.fileName,
                        fileType: data.fileType,
                        isFile: true,
                        messageId: (0, uuid_1.v4)(),
                    });
                    savedMessage = yield message.save();
                }
                else if (data.audio) {
                    console.log('Audio data received:', data.audio);
                    const buffer = Buffer.from(data.audio, 'base64');
                    console.log('Buffer created:', buffer);
                    const uniqueFileName = `${Date.now()}-${data.voiceFileName}`;
                    const file = {
                        buffer,
                        originalname: uniqueFileName,
                        mimetype: data.voiceFileType || 'audio/webm',
                    };
                    console.log('file:', file);
                    const { Location } = yield (0, s3Uploader_1.uploadToS3)(file);
                    const message = new MessageModel_1.default({
                        chat: data.roomId,
                        sender: data.sender,
                        senderModel: data.senderModel,
                        fileUrl: Location,
                        fileName: data.voiceFileName,
                        fileType: data.voiceFileType,
                        isFile: true,
                        isVoice: true,
                        messageId: (0, uuid_1.v4)(),
                    });
                    savedMessage = yield message.save();
                }
                else {
                    console.log('No content or file to send.');
                    socket.emit('error', { message: 'Message content is empty.' });
                    return;
                }
                io.to(data.roomId).emit('receiveMessage', savedMessage);
                console.log('Message saved and sent:', savedMessage);
                const unreadCounts = yield MessageModel_1.default.countDocuments({
                    senderModel: data.senderModel,
                    read: false,
                });
                if (data.senderModel === 'User') {
                    console.log("Calculated unread countu:", unreadCounts);
                    io.to(data.roomId).emit('unreadCount', { unreadCount: unreadCounts, recipient: 'Vendor' });
                }
                else if (data.senderModel === 'Vendor') {
                    console.log("Calculated unread countv:", unreadCounts);
                    io.to(data.roomId).emit('unreadCount', { unreadCount: unreadCounts, recipient: 'User' });
                }
            }
            catch (error) {
                console.error('Error processing message:', error);
                socket.emit('error', { message: 'Error processing message' });
            }
        }));
        socket.on('deleteMessage', (messageId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log('Received delete request for message ID:', messageId);
                const deletedMessage = yield MessageModel_1.default.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
                if (!deletedMessage) {
                    console.error('Message not found:', messageId);
                    socket.emit('error', { message: 'Message not found' });
                    return;
                }
                if (deletedMessage.chat) {
                    const chatId = deletedMessage.chat.toString();
                    io.to(chatId).emit('messageDeleted', { messageId, deleted: true });
                    console.log('Message marked as deleted and notification sent:', { messageId });
                }
                else {
                    console.error('Message or its chat is undefined');
                }
            }
            catch (error) {
                console.error('Error marking message as deleted:', error);
                socket.emit('error', { message: 'Error deleting message' });
            }
        }));
        socket.on('chatRequest', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, vendorId, userName }) {
            console.log('Chat request received:', { userId, vendorId, userName });
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(vendorId)) {
                    console.error('Invalid userId or vendorId:', { userId, vendorId });
                    return;
                }
                const newChat = yield chatModel_1.default.create({
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
            }
            catch (error) {
                console.error('Error sending chat request:', error);
            }
        }));
        socket.on('acceptChatRequest', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, vendorId, roomId }) {
            console.log('Accept chat request received:', { userId, vendorId, roomId });
            try {
                const chat = yield chatModel_1.default.findById(roomId);
                if (!chat) {
                    throw new Error(`Chat not found: ${roomId}`);
                }
                chat.is_accepted = 'accepted';
                yield chat.save();
                socket.join(roomId);
                io.to(userId).emit('chatRequestAccepted', { roomId, userId, vendorId });
                io.to(vendorId).emit('chatRequestAccepted', { roomId, userId, vendorId });
                console.log(`Chat request accepted for room ${roomId}`);
            }
            catch (error) {
                console.error('Error accepting chat request:', error);
                socket.emit('error', { message: 'Error accepting chat request' });
            }
        }));
        socket.on('messageRead', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, userId }) {
            try {
                yield MessageModel_1.default.updateMany({ chat: roomId, sender: { $ne: userId }, read: false }, { $set: { read: true } });
                const updatedMessages = yield MessageModel_1.default.find({ chat: roomId });
                io.to(roomId).emit('messagesUpdated', updatedMessages);
                const unreadCounts = yield MessageModel_1.default.countDocuments({
                    chat: roomId,
                    sender: { $ne: userId },
                    read: false,
                });
                io.to(userId).emit('unreadCount', { roomId, unreadCounts });
            }
            catch (error) {
                console.error('Error marking messages as read:', error);
            }
        }));
        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('typing', data);
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.default = handleSocketEvents;
