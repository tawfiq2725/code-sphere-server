import mongoose, { Document, Schema, model } from "mongoose";

export interface IMessage extends Document {
  sender: "student" | "tutor";
  message: string;
  type: "img" | "txt";
  deleted: boolean;
  read: boolean;
}

interface IChat extends Document {
  _id: string;
  tutorId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  messages: IMessage[];
}
// Create message schema
const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      enum: ["student", "tutor"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["img", "txt"],
      default: "txt",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create chat schema
const ChatSchema = new Schema<IChat>(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ tutorId: 1, userId: 1 });
const ChatModel = model<IChat>("Chat", ChatSchema);

export default ChatModel;
