"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { MessageType } from "@/types/message";
import { useUser } from "../context/UserContext"; 

interface UseChatChannelProps {
  chatId: string;
  currentUserId: string;
  blockedByMe?: any[];
  blockedMe?: any[];
}

export const useChatChannel = ({
  chatId,
  currentUserId,
  blockedByMe = [],
  blockedMe = [],
}: UseChatChannelProps) => {
  const { user } = useUser(); 
  const [messages, setMessages] = useState<MessageType[]>([]);
  const channelRef = useRef<any>(null);
  const blockedRef = useRef({ blockedByMe, blockedMe });
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  blockedRef.current = { blockedByMe, blockedMe };

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const setupChannel = useCallback(async () => {
    if (!chatId || !currentUserId || !isMountedRef.current || !user) return;

    cleanupChannel();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      } else {
        console.warn("No auth token available for realtime");
        return;
      }

      const channel = supabase
        .channel(`chat-${chatId}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${chatId}`,
          },
          async (payload) => {
            const newMessage = payload.new as MessageType;
            const { blockedByMe, blockedMe } = blockedRef.current;

            const isBlocked =
              blockedByMe.some((c) => c.contact_id === newMessage.user_id) ||
              blockedMe.some((c) => c.owner_id === newMessage.user_id);

            if (!isBlocked) {
              setMessages(prev => {
                if (prev.some(m => m.id === newMessage.id)) return prev; 
                return [...prev, newMessage];
              });
            }
          }
        )
        .subscribe((status) => {
          console.log("Chat channel", chatId, "status:", status);

          if (!isMountedRef.current) return;

          if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            console.warn("Channel koptu, 3 saniye sonra yeniden bağlanıyor...");
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current && user) {
                setupChannel();
              }
            }, 3000);
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error("Channel setup error:", error);
    }
  }, [chatId, currentUserId, cleanupChannel, user]); 

  useEffect(() => {
    isMountedRef.current = true;
    
    if (chatId && currentUserId && user) {
      setupChannel();
    }

    return () => {
      isMountedRef.current = false;
      cleanupChannel();
    };
  }, [chatId, currentUserId, setupChannel, cleanupChannel, user]); 

  return { messages, setMessages };
};