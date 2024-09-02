
import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["User", "Vendor"],
    },
    content: { type: String, default: "" }, 
    fileUrl: { type: String, default: "" }, 
    fileName: { type: String, default: "" }, 
    fileType: { type: String, default: "" }, 
    isFile: { type: Boolean, default: false }, 
    isVoice: { type: Boolean, default: false },
    chat: { type: Schema.Types.ObjectId, ref: "ChatModel" },
    deleted: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;

 