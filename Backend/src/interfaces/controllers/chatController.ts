// chatController.js (or similar file)
import { log } from "console";
import ChatModel, {IChatModel} from "../../infrastructure/database/dbmodel/chatModel";// Adjust path as necessary
import {Request , Response} from 'express'

export default{
  acceptChatRequest : async (req:Request, res:Response) => {
    const { roomId } = req.params;
  try {
    const chat = await ChatModel.findByIdAndUpdate(
      roomId,
      { is_accepted: 'accepted' },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Error accepting chat:', error);
    res.status(500).json({ message: 'Error updating chat' });
  }
},
getMessages:async(req:Request , res:Response) => {
    const {roomId} = req.params
    log(roomId,'hiiiiiiiiii')
    try {
      const messages = await ChatModel.find({ chat: roomId }).exec();
      console.log(messages,'msgs') // Adjust based on your schema
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
},
previousChats:async(req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;
    console.log(vendorId,'vviidd')
    
    // Find chats with is_accepted 'accepted' and populate users
    const chats = await ChatModel.find({ is_accepted: 'accepted', users: vendorId })
        .populate('users', 'name') // Adjust the fields you want to retrieve from the Users model
        .exec();

      if (!chats) {
        return res.status(404).json({ message: 'No accepted chats found.' });
      }

      // Flatten the array of users from chats and remove duplicates
      const uniqueUsers = Array.from(
        new Set(chats.flatMap(chat => chat.users).filter(user => user._id.toString() !== vendorId))
      );

      res.json(uniqueUsers);
    } catch (error) {
      console.error('Error fetching accepted chats:', error);
      res.status(500).json({ message: 'Error fetching accepted chats.' });
    }
  },


}

