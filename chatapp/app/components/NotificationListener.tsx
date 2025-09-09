"use client";
import React, { useEffect, useRef } from "react";
import { realtimeClient, supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify"; 
import { Notification } from "@/types/notification";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";


const NotificationListener: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const { session } = useUser();
  const channelRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.access_token) return; 
    if (channelRef.current) return; 

    channelRef.current = realtimeClient
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.receiver_id === currentUserId) {
            const currentChatId = pathname.split("/chats/")[1]; 

            if (currentChatId === newMessage.chat_id) {
              console.log("Aktif sohbet açık, bildirim gösterilmedi");
              return;
            }

          //  toast.info(`Yeni mesaj: ${newMessage.message}`);
          }}
      )
      .subscribe((status) => {
        console.log("Notification channel status:", status);
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentUserId]);

  return null;
};

export default NotificationListener;
