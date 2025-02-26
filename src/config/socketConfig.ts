import { config } from "dotenv";
config();
import { Server as HttpServer } from "http";
import { Server as SocketIOserver } from "socket.io";
import { configFrontend } from "./ConfigSetup";
import ChatModel from "../infrastructure/database/chatSchema";

export const initSocket = (server: HttpServer): SocketIOserver => {
  const io = new SocketIOserver(server, {
    cors: {
      origin: configFrontend.frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join:chat", async (data) => {
      try {
        let chatId = data.chatId;

        if (!chatId) {
          let chat = await ChatModel.findOne({
            tutorId: data.tutorId,
            userId: data.userId,
          });
          if (!chat) {
            chat = new ChatModel({
              tutorId: data.tutorId,
              userId: data.userId,
              messages: [],
            });
            await chat.save();
          }
          chatId = chat._id.toString();
        }

        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat room ${chatId}`);

        const chat = await ChatModel.findById(chatId);
        socket.emit("chat:history", chat);
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("chat:error", { error: "Failed to join chat" });
      }
    });

    socket.on("message:send", async (data) => {
      console.log("Received message:", data);
      try {
        let chat = await ChatModel.findById(data.chatId);
        if (!chat) {
          chat = new ChatModel({
            tutorId: data.tutorId,
            userId: data.userId,
            messages: [],
          });
        }

        const newMessage: any = {
          sender: data.sender,
          message: data.message,
          type: data.type || "txt",
          deleted: false,
          read: false,
        };

        chat.messages.push(newMessage);
        await chat.save();

        io.to(data.chatId).emit("message:receive", newMessage);

        socket.emit("message:sent", { success: true, chatId: data.chatId });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("message:error", { error: "Failed to send message." });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
