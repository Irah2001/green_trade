'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import {
  conversationService,
  connectSocket,
  disconnectSocket,
  type Conversation,
  type Message,
} from '@/services/conversation.service';
import { apiFetch } from '@/services/api';

interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
}

export default function MessagesPage() {
  const user = useAppStore((state) => state.user);
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveConversationId = useAppStore((state) => state.setActiveConversationId);
  const previousPage = useAppStore((state) => state.previousPage);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [userCache, setUserCache] = useState<Record<string, UserPublic>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConvRef = useRef<string | null>(activeConversationId);

  // Keep ref in sync for use in socket callbacks
  useEffect(() => {
    activeConvRef.current = activeConversationId;
  }, [activeConversationId]);

  // Load conversations on mount
  useEffect(() => {
    conversationService
      .getConversations()
      .then((convs) => {
        const sorted = convs.sort(
          (a, b) =>
            new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
        );
        setConversations(sorted);

        // Fetch names for all other participants
        const otherIds = [
          ...new Set(
            sorted.flatMap((c) => c.participantIds.filter((id) => id !== user?.id))
          ),
        ];
        Promise.all(
          otherIds.map((id) =>
            apiFetch<UserPublic>(`/api/users/${id}`).catch(() => null)
          )
        ).then((results) => {
          const cache: Record<string, UserPublic> = {};
          results.forEach((u) => { if (u) cache[u.id] = u; });
          setUserCache(cache);
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Connect socket and register listeners
  useEffect(() => {
    const socket = connectSocket();

    socket.on(
      'conversation_history',
      ({ messages: msgs }: { conversationId: string; messages: Message[] }) => {
        setMessages(msgs);
      }
    );

    socket.on('new_message', (msg: Message) => {
      if (msg.conversationId === activeConvRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === msg.conversationId ? { ...c, lastActivityAt: msg.createdAt } : c
          )
          .sort(
            (a, b) =>
              new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
          )
      );
    });

    socket.on('message_updated', (updated: Message) => {
      if (updated.conversationId === activeConvRef.current) {
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      }
    });

    socket.on('message_deleted', ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    return () => {
      socket.off('conversation_history');
      socket.off('new_message');
      socket.off('message_updated');
      socket.off('message_deleted');
      disconnectSocket();
    };
  }, []);

  // Join conversation when activeConversationId changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    const socket = connectSocket();
    const doJoin = () => {
      socket.emit('join_conversation', activeConversationId);
      socket.emit('mark_read', activeConversationId);
    };
    if (socket.connected) {
      doJoin();
    } else {
      socket.once('connect', doJoin);
    }
    return () => {
      socket.off('connect', doJoin);
    };
  }, [activeConversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !activeConversationId) return;
    const socket = connectSocket();
    socket.emit('send_message', {
      conversationId: activeConversationId,
      content: inputValue.trim(),
    });
    setInputValue('');
  }, [inputValue, activeConversationId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherParticipantLabel = (conv: Conversation) => {
    const otherId = conv.participantIds.find((id) => id !== user?.id) ?? conv.participantIds[0];
    const cached = userCache[otherId];
    return cached ? `${cached.firstName} ${cached.lastName}` : `Producteur …${otherId.slice(-4)}`;
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-8rem)]">
      <Button
        variant="ghost"
        onClick={() => setCurrentPage(previousPage ?? 'home')}
        className="mb-4 text-gray-600 hover:text-[#4A7C59]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      <div className="flex h-[calc(100%-3rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Left: Conversation list */}
        <div
          className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${
            activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Aucune conversation pour l&apos;instant</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    activeConversationId === conv.id
                      ? 'bg-[#A8D5BA]/20 border-l-4 border-l-[#4A7C59]'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#A8D5BA] flex items-center justify-center text-[#4A7C59] font-bold shrink-0">
                      P
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {getOtherParticipantLabel(conv)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(conv.lastActivityAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Chat window */}
        <div
          className={`flex-1 flex flex-col ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversationId ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setActiveConversationId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="w-9 h-9 rounded-full bg-[#A8D5BA] flex items-center justify-center text-[#4A7C59] font-bold">
                  P
                </div>
                <p className="font-medium text-sm">
                  {activeConversation
                    ? getOtherParticipantLabel(activeConversation)
                    : 'Conversation'}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Commencez la conversation !
                  </div>
                )}
                {messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                          isOwn
                            ? 'bg-[#4A7C59] text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-white/60' : 'text-gray-400'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrire un message..."
                    className="rounded-full border-gray-200 focus:border-[#4A7C59]"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="bg-[#4A7C59] hover:bg-[#3a6349] text-white rounded-full px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
