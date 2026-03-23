import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ConversationRepository = {
  async findOrCreate(participantIds: string[], productId?: string) {
    const sorted = [...participantIds].sort();

    const existing = await prisma.conversation.findFirst({
      where: {
        AND: sorted.map((id) => ({ participantIds: { has: id } })),
        ...(productId ? { productId } : {}),
      },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 50 } },
    });

    if (existing) return existing;

    return prisma.conversation.create({
      data: {
        participantIds: sorted,
        productId: productId ?? null,
        lastActivityAt: new Date(),
      },
      include: { messages: true },
    });
  },

  async findByUserId(userId: string) {
    return prisma.conversation.findMany({
      where: { participantIds: { has: userId } },
      orderBy: { lastActivityAt: "desc" },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  },

  async findById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  },

  async getMessages(conversationId: string, limit = 50, before?: Date) {
    return prisma.message.findMany({
      where: {
        conversationId,
        ...(before ? { createdAt: { lt: before } } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
  },

  async createMessage(conversationId: string, senderId: string, content: string) {
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: { conversationId, senderId, content },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { lastActivityAt: new Date() },
      }),
    ]);
    return message;
  },

  async markAsRead(conversationId: string, userId: string) {
    return prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });
  },

  async updateMessage(messageId: string, content: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { content },
    });
  },

  async deleteMessage(messageId: string) {
    return prisma.message.delete({ where: { id: messageId } });
  },

  async findMessageById(messageId: string) {
    return prisma.message.findUnique({ where: { id: messageId } });
  },

  async deleteConversation(conversationId: string) {
    await prisma.message.deleteMany({ where: { conversationId } });
    return prisma.conversation.delete({ where: { id: conversationId } });
  },
};
