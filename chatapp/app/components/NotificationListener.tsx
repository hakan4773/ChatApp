"use client";
import React, { useEffect } from "react";
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
  useEffect(() => {
    const channel = supabase
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return null;
};

export default NotificationListener;
