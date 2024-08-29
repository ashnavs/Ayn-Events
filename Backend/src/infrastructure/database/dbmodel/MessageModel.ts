// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const MessageSchema = new Schema(
//   {
//     sender: {
//       type: Schema.Types.ObjectId,
//       refPath: "senderModel",
//       required: true,
//     },
//     senderModel: {
//       type: String,
//       required: true,
//       enum: ["User", "Vendor"],
//     },
//     content: { type: String, required: true },
//     // textContent: { type: String, default: '' }, 
//   imageUrl: { type: String, default: '' }, // Store image URL
//   isImage: { type: Boolean, default: false },
//     chat: { type: Schema.Types.ObjectId, ref: "ChatModel" },
//     type: String,
//     read: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", MessageSchema);
       
// export default Message;






// MessageModel.ts (with updates)
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
    content: { type: String, default: "" }, // Text content
    fileUrl: { type: String, default: "" }, // Store file URL
    fileName: { type: String, default: "" }, // Store file name
    fileType: { type: String, default: "" }, // Store file type (image, video, etc.)
    isFile: { type: Boolean, default: false }, // Boolean flag to check if the message is a file
    isVoice: { type: Boolean, default: false },
    chat: { type: Schema.Types.ObjectId, ref: "ChatModel" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;

 