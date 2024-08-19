import mongoose, { Schema,  model, Document, models } from "mongoose";


export interface IChatModel extends Document {
  users: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId;
  createdAt: Date;  
  updatedAt: Date;
  _id?: mongoose.Types.ObjectId;
  is_blocked: boolean;
  is_accepted: 'pending' | 'accepted' | 'rejected';
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
      enum: ['pending', 'accepted', 'rejected'], // Define enum options
      default: 'pending', // Default value is 'pending'
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<IChatModel>("ChatModel", ChatSchema);

export default ChatModel;
