"use client"
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { MessageType } from "@/types/message";
import { useUser } from "../context/UserContext";

interface Props {
  message: MessageType;
  messages: MessageType[];
  setReplyingTo: (message: MessageType | null) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const MessageContextMenu: React.FC<Props> = ({ message, onClose, onDelete, messages, setReplyingTo }) => {
  const {user}=useUser();
   const handleDelete= async () => {

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", message.id)
      .eq("user_id", message.user_id)
      .select();
     
      const { error: reactionError } = await supabase
      .from("message_reactions")
      .delete()
      .eq("message_id", message.id)
      .eq("user_id", message.user_id)
      .select();

    if (error || reactionError) {
      toast.error("Bu mesajı silemezsiniz!");
    } else {
      toast.success("Mesaj silindi");
      onDelete(message.id); 
    }
  };
 
const handleReply = (id: string) => {
  const msg = messages.find(m => m.id === id);
  if (msg) {
    setReplyingTo(msg); 
  }
};

    
    return (
    <div className="absolute top-6 right-0 bg-white text-black dark:text-white dark:bg-gray-800 rounded-md shadow-md z-50 w-32">
      <button
        onClick={() => {
          navigator.clipboard.writeText(message.content);
          onClose();
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Kopyala
      </button>
      {message.user_id === user?.id && (
         <button
        onClick={() => {
          handleDelete();
          onClose();
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Sil
      </button>
      )}
     

        <button
        onClick={() => {
          handleReply(message.id);
          onClose();
        }}
        className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Yanıtla
      </button>
    </div>
  );
};

export default MessageContextMenu;
