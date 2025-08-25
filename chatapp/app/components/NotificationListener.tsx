"use client";
import React, { useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify"; 

interface Notification {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

const NotificationListener: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!currentUserId) return;
    if (channelRef.current) return; // zaten varsa tekrar açma

    channelRef.current = supabase
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
          const newNotification = payload.new as Notification;
          toast.success(`📩 Yeni mesaj: ${newNotification.message}`);
        }
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
