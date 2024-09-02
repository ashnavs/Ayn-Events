"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const MessageSchema = new Schema({
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
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", MessageSchema);
exports.default = Message;
