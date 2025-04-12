import { configFrontend } from "./ConfigSetup";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import ChatModel from "../infrastructure/database/chatSchema";
import UserModel from "../infrastructure/database/userSchema";

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
    socket.on("register", (data) => {
      const { type, id } = data;
      if (type === "tutor") {
        socket.join(`tutor:${id}`);
      } else if (type === "student") {
        socket.join(`student:${id}`);
      }
    });

    socket.on("join:chat", async (data) => {
      try {
        const isBlocked = await checkIfBlocked(data.userId, data.tutorId);
        if (isBlocked.blocked) {
          socket.emit("chat:blocked", {
            error: `This conversation is unavailable because ${isBlocked.blockedEntity} has been blocked by admin`,
          });
          return;
        }

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

        socket.emit("chat:history", chat);
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("chat:error", { error: "Failed to join chat" });
      }
    });

    // Handle sending a message
    socket.on("message:send", async (data) => {
      try {
        let chat = await ChatModel.findById(data.chatId);
        if (!chat) {
          socket.emit("message:error", { error: "Chat not found" });
          return;
        }

        const isBlocked = await checkIfBlocked(
          chat.userId.toString(),
          chat.tutorId.toString()
        );
        if (isBlocked.blocked) {
          socket.emit("message:blocked", {
            error: `Message could not be sent because ${isBlocked.blockedEntity} has been blocked by admin`,
          });
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

    socket.on("message:delete", async (data) => {
      try {
        const { chatId, messageId, sender } = data;
        const chat = await ChatModel.findById(chatId);
        if (!chat) {
          socket.emit("message:error", { error: "Chat not found" });
          return;
        }

        const message = chat.messages.find(
          (msg: any) => msg._id.toString() === messageId
        );
        if (!message) {
          socket.emit("message:error", { error: "Message not found" });
          return;
        }

        if (message.sender !== sender) {
          socket.emit("message:error", {
            error: "You can only delete your own messages",
          });
          return;
        }

        message.deleted = true;
        await chat.save();

        io.to(chatId).emit("message:updated", {
          messageId,
          deleted: true,
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("message:error", { error: "Failed to delete message" });
      }
    });


    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

async function checkIfBlocked(
  userId: string,
  tutorId: string
): Promise<{ blocked: boolean; blockedEntity: string }> {
  try {
    const user = await UserModel.findById(userId);
    const tutor = await UserModel.findById(tutorId);
    if (!user || !tutor) {
      console.error("User or tutor not found during block check");
      return { blocked: false, blockedEntity: "" };
    }

    if (user.isBlocked) {
      return { blocked: true, blockedEntity: "the student" };
    }

    if (tutor.isBlocked) {
      return { blocked: true, blockedEntity: "the tutor" };
    }

    return { blocked: false, blockedEntity: "" };
  } catch (error) {
    console.error("Error checking blocked status:", error);
    return { blocked: false, blockedEntity: "" };
  }
}
