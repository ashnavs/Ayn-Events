"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = __importDefault(require("../controllers/chatController"));
const messageRouter = (0, express_1.Router)();
messageRouter.get('/:roomId', chatController_1.default.getMessages);
messageRouter.get('/accepted/:vendorId', chatController_1.default.previousChats);
exports.default = messageRouter;
