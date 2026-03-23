import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ConversationRepository } from "../repositories/ConversationRepository.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface AuthSocket extends Socket {
  userId?: string;
}

export function initSocket(httpServer: HttpServer, allowedOrigins: string[]) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware d'authentification JWT
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Token manquant"));

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Token invalide"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    const userId = socket.userId!;
    // eslint-disable-next-line no-console
    console.log(`[Socket] Connecté: ${userId} (${socket.id})`);

    // Rejoindre une conversation et recevoir l'historique
    socket.on("join_conversation", async (conversationId: string) => {
      try {
        const conv = await ConversationRepository.findById(conversationId);
        if (!conv || !conv.participantIds.includes(userId)) {
          socket.emit("error", { message: "Accès refusé à cette conversation" });
          return;
        }
        socket.join(conversationId);
        const messages = await ConversationRepository.getMessages(conversationId, 50);
        socket.emit("conversation_history", { conversationId, messages });
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    // Quitter une conversation
    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(conversationId);
    });

    // Envoyer un message
    socket.on("send_message", async (data: { conversationId: string; content: string }) => {
      const { conversationId, content } = data;
      if (!content?.trim()) return;

      try {
        const conv = await ConversationRepository.findById(conversationId);
        if (!conv || !conv.participantIds.includes(userId)) {
          socket.emit("error", { message: "Accès refusé" });
          return;
        }

        const message = await ConversationRepository.createMessage(conversationId, userId, content.trim());

        // Diffuser à tous les membres de la conversation
        io.to(conversationId).emit("new_message", message);
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    // Indicateur de frappe
    socket.on("typing", (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(data.conversationId).emit("user_typing", {
        userId,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
    });

    // Marquer comme lu
    socket.on("mark_read", async (conversationId: string) => {
      try {
        await ConversationRepository.markAsRead(conversationId, userId);
        io.to(conversationId).emit("messages_read", { conversationId, userId });
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    // Modifier un message
    socket.on("edit_message", async (data: { messageId: string; content: string }) => {
      try {
        const msg = await ConversationRepository.findMessageById(data.messageId);
        if (!msg || msg.senderId !== userId) {
          socket.emit("error", { message: "Accès refusé" });
          return;
        }
        const updated = await ConversationRepository.updateMessage(data.messageId, data.content.trim());
        io.to(msg.conversationId).emit("message_updated", updated);
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    // Supprimer un message
    socket.on("delete_message", async (messageId: string) => {
      try {
        const msg = await ConversationRepository.findMessageById(messageId);
        if (!msg || msg.senderId !== userId) {
          socket.emit("error", { message: "Accès refusé" });
          return;
        }
        const conversationId = msg.conversationId;
        await ConversationRepository.deleteMessage(messageId);
        io.to(conversationId).emit("message_deleted", { messageId, conversationId });
      } catch (e: any) {
        socket.emit("error", { message: e.message });
      }
    });

    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log(`[Socket] Déconnecté: ${userId} (${socket.id})`);
    });
  });

  return io;
}
