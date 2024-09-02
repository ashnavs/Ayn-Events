import mongoose, { Schema,  model, Document, models } from "mongoose";



export interface IChatModel extends Document {
  users: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId;
  createdAt: Date;  
  updatedAt: Date;
  _id?: mongoose.Types.ObjectId;
  is_blocked: boolean;
  is_accepted: 'pending' | 'accepted' | 'rejected';
  unreadCount:Map<string, number>; 
}
const ChatSchema: Schema = new Schema<IChatModel>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    is_blocked: {
      type: Boolean,
      default: false, 
    },
    is_accepted: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending', 
    },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<IChatModel>("ChatModel", ChatSchema);

export default ChatModel;
