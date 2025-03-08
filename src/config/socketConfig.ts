import { configFrontend } from "./ConfigSetup";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import ChatModel from "../infrastructure/database/chatSchema";

dotenv.config();

export const initSocket = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: configFrontend.frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("register", (data) => {
      const { type, id } = data;
      if (type === "tutor") {
        socket.join(`tutor:${id}`);
        console.log(`tutor ${id} joined room tutor:${id}`);
      } else if (type === "student") {
        socket.join(`student:${id}`);
        console.log(`student ${id} joined room student:${id}`);
      }
    });

    // Handle joining a chat room
    socket.on("join:chat", async (data) => {
      try {
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

        const chatId = chat._id.toString();
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat room ${chatId}`);
        socket.emit("chat:history", chat);
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("chat:error", { error: "Failed to join chat" });
      }
    });

    // Handle sending a message
    socket.on("message:send", async (data) => {
      console.log("Received message:", data);
      try {
        let chat = await ChatModel.findById(data.chatId);
        if (!chat) {
          socket.emit("message:error", { error: "Chat not found" });
          return;
        }

        const newMessage = {
          sender: data.sender,
          message: data.message,
          type: data.type || "txt",
          deleted: false,
          read: false,
        };

        chat.messages.push(newMessage as any);
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];
        io.to(data.chatId).emit("message:receive", savedMessage);

        // Enrich the notification payload
        const senderId =
          data.sender === "student"
            ? chat.userId.toString()
            : chat.tutorId.toString();
        const recipientType = data.sender === "student" ? "tutor" : "student";
        const recipientId =
          data.sender === "student"
            ? chat.tutorId.toString()
            : chat.userId.toString();

        io.to(`${recipientType}:${recipientId}`).emit("notification", {
          chatId: data.chatId,
          senderType: data.sender,
          senderId: senderId,
          message: `You have a new message from ${
            data.sender === "student" ? "the student" : "the tutor"
          }`,
        });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("message:error", { error: "Failed to send message" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
