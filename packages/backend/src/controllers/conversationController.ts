import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { ConversationRepository } from "../repositories/ConversationRepository.js";

export const createOrFindConversation = async (req: AuthRequest, res: Response) => {
  const { otherUserId, productId } = req.body;
  if (!otherUserId) return res.status(400).json({ message: "otherUserId requis" });

  try {
    const conversation = await ConversationRepository.findOrCreate(
      [req.userId!, otherUserId],
      productId
    );
    res.json(conversation);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await ConversationRepository.findByUserId(req.userId!);
    res.json(conversations);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 50;
  const before = req.query.before ? new Date(req.query.before as string) : undefined;

  try {
    const conv = await ConversationRepository.findById(id);
    if (!conv) return res.status(404).json({ message: "Conversation introuvable" });
    if (!conv.participantIds.includes(req.userId!))
      return res.status(403).json({ message: "Accès refusé" });

    const messages = await ConversationRepository.getMessages(id, limit, before);
    res.json(messages);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await ConversationRepository.markAsRead(id, req.userId!);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const editMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Contenu requis" });

  try {
    const msg = await ConversationRepository.findMessageById(messageId);
    if (!msg) return res.status(404).json({ message: "Message introuvable" });
    if (msg.senderId !== req.userId) return res.status(403).json({ message: "Accès refusé" });

    const updated = await ConversationRepository.updateMessage(messageId, content.trim());
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  try {
    const msg = await ConversationRepository.findMessageById(messageId);
    if (!msg) return res.status(404).json({ message: "Message introuvable" });
    if (msg.senderId !== req.userId) return res.status(403).json({ message: "Accès refusé" });

    await ConversationRepository.deleteMessage(messageId);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteConversation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const conv = await ConversationRepository.findById(id);
    if (!conv) return res.status(404).json({ message: "Conversation introuvable" });
    if (!conv.participantIds.includes(req.userId!))
      return res.status(403).json({ message: "Accès refusé" });

    await ConversationRepository.deleteConversation(id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
