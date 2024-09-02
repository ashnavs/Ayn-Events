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
const console_1 = require("console");
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/chatModel"));
exports.default = {
    acceptChatRequest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        try {
            const chat = yield chatModel_1.default.findByIdAndUpdate(roomId, { is_accepted: 'accepted' }, { new: true });
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
            res.json(chat);
        }
        catch (error) {
            console.error('Error accepting chat:', error);
            res.status(500).json({ message: 'Error updating chat' });
        }
    }),
    getMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        (0, console_1.log)(roomId, 'hiiiiiiiiii');
        try {
            const messages = yield chatModel_1.default.find({ chat: roomId }).exec();
            console.log(messages, 'msgs');
            res.json(messages);
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Error fetching messages' });
        }
    }),
    previousChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendorId = req.params.vendorId;
            console.log(vendorId, 'vviidd');
            const chats = yield chatModel_1.default.find({ is_accepted: 'accepted', users: vendorId })
                .populate('users', 'name')
                .exec();
            if (!chats) {
                return res.status(404).json({ message: 'No accepted chats found.' });
            }
            const uniqueUsers = Array.from(new Set(chats.flatMap(chat => chat.users).filter(user => user._id.toString() !== vendorId)));
            res.json(uniqueUsers);
        }
        catch (error) {
            console.error('Error fetching accepted chats:', error);
            res.status(500).json({ message: 'Error fetching accepted chats.' });
        }
    }),
};
