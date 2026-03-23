import { io, Socket } from 'socket.io-client';
import { apiFetch } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Conversation {
  id: string;
  participantIds: string[];
  lastActivityAt: string;
  productId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  readBy: string[];
}

let socket: Socket | null = null;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gt_token') ?? null;
}

export function connectSocket(): Socket {
  if (socket) return socket; // return even if still connecting
  const token = getToken();
  socket = io(API_URL, {
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}

export const conversationService = {
  createOrFind: (otherUserId: string, productId?: string) =>
    apiFetch<Conversation>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ otherUserId, productId }),
    }),

  getConversations: () => apiFetch<Conversation[]>('/api/conversations'),

  getMessages: (conversationId: string, limit = 50) =>
    apiFetch<Message[]>(`/api/conversations/${conversationId}/messages?limit=${limit}`),
};
