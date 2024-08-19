// import Message from '../../infrastructure/database/dbmodel/MessageModel';


// export const handleMessage = async (data: {
//   conversationId: string;
//   sender: string;
//   text: string;
// }) => {
//   const { conversationId, sender, text } = data;

//   const message = new Message({
//     conversationId,
//     sender,
//     text,
//   });

//   await message.save();

//   // Update the last message in the conversation
//   await Conversation.findByIdAndUpdate(conversationId, {
//     lastMessage: text,
//     updatedAt: Date.now(),
//   });

//   return message;
// };
