import { Router } from "express";
import chatController from "../controllers/chatController";

const messageRouter = Router()

messageRouter.get('/:roomId',chatController.getMessages)
messageRouter.get('/accepted/:vendorId',chatController.previousChats)

export default messageRouter