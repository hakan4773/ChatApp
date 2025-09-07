"use client";
import { format } from "timeago.js";
import Image from "next/image";
import { DocumentIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import MessageContextMenu from "./MessageContextMenu";
import {  MessageType, ReactionType } from "@/types/message";
import ReactionPicker from "./ReactionPicker";
import { supabase } from "../lib/supabaseClient";
interface MessagesListProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setReplyingTo: (message: MessageType | null) => void;
  userId: string | undefined;
  chatUsers: {
    id: string;
    avatar_url: string | null;
  }[];
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  setMessages,
  userId,
  chatUsers,
  setReplyingTo
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

   const chatRef = useRef<HTMLDivElement>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };
   const handleMessageClick = (msg: MessageType) => {
    setSelectedMessage(msg);
    setIsContextMenuOpen((prev) => (selectedMessage === msg ? !prev : true));
  };
 const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const prevMessageCount = useRef(0);

useEffect(() => {
  if (messages.length > prevMessageCount.current) {
    scrollToBottom();
  }
  prevMessageCount.current = messages.length;
}, [messages]);

 useEffect(() => {
  async function fetchReactions() {
    try {
      const { data, error } = await supabase
        .from("message_reactions")
        .select("*")
        .order("created_at", { ascending: false });

        if (error) {
          console.error("Reactionlar alınamadı:", error.message);
        }

      if (data) {
        setMessages((prevMessages) =>
          prevMessages.map((message) => {
            const reactions = data.filter(
              (reaction) => reaction.message_id === message.id
            );
            return {
              ...message,
              reactions,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  }
  fetchReactions();
}, []);

  const handleReactionClick = async (messageId: string, emoji: string) => {
  if (!userId) return;

  const message = messages.find((m) => m.id === messageId);
  if (!message) return;

  const existingReactions = message.reactions || [];
  const userReaction = existingReactions.find((r) => r.user_id === userId);

  if (userReaction) {
    if (userReaction.emoji === emoji) {
      const { error: deleteError } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", userId);

      if (deleteError) {
        console.error("Reaction silinemedi:", deleteError.message);
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, reactions: existingReactions.filter((r) => r.user_id !== userId) }
              : m
          )
        );
      }
    } else {
      const { error: updateError } = await supabase
        .from("message_reactions")
        .update({ emoji })
        .eq("message_id", messageId)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Reaction güncellenemedi:", updateError.message);
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  reactions: existingReactions.map((r) =>
                    r.user_id === userId ? { ...r, emoji } : r
                  ),
                }
              : m
          )
        );
      }
    }
  } else {
    const { data, error } = await supabase
      .from("message_reactions")
      .insert({ user_id: userId, message_id: messageId, emoji })
      .select()
      .single();

    if (error) {
      console.error("Reaction eklenemedi:", error.message);
    } else if (data) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, reactions: [...(m.reactions || []), data] }
            : m
        )
      );
    }
  }
};

  return (
<div
ref={chatRef}
      style={{
        height: "400px",
        overflowY: "auto",
        padding: "10px"
      }}
      className="flex-1 p-4 overflow-y-auto  space-y-4 bg-gradient-to-b bg-[url('/bg.jpg')] dark:bg-[url('/darkbg.jpg')]
    bg-cover bg-center from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {messages.length > 0 && (
        <div className="flex justify-center">
          <span className="inline-block px-4 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 rounded-full shadow">
            {new Date(messages[0].created_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      {messages.map((msg, index) => {
        const replyTo = msg.reply_to
          ? messages.find((m) => m.id === msg.reply_to)
          : null;
     
     return ( 
        <div
          key={msg.id}
          className={`flex  ${
            msg.user_id === userId ? "justify-end" : "items-start space-x-3"
          }`}
          onMouseEnter={() => setHoveredMessageId(msg.id)}
          onMouseLeave={() => setHoveredMessageId(null)}
        >
          {msg.user_id !== userId && (
            <Image
              src={
                chatUsers.find((user) => user.id === msg.user_id)?.avatar_url ||
                "/5.jpg"
              }
              width={40}
              height={40}
              alt="avatar"
              className="rounded-full h-10 w-10 object-cover"
            />
          )}

          <div onClick={() => setSelectedMessage(msg)}
            className={`relative lg:p-2 p-3 rounded-2xl min-w-[10rem] max-w-[80%]   shadow-md transition-all duration-200 ${
              msg.user_id === userId
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-tl-none"
            }`}
          >
            {/* Reactions */}
               {hoveredMessageId === msg.id && (
                    <ReactionPicker onSelect={(emoji) => handleReactionClick(msg.id, emoji)} />
                  )}




             
              {replyTo && (
                <div className=" border-l-3 mt-4 border-blue-400 pl-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-r">
                  {replyTo.content || "Mesaj silindi"}
                </div>
              )}
            {msg.location ? (
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors"
                onClick={() =>
                  openGoogleMaps(msg.location!.lat, msg.location!.lng)
                }
              >
                <MapPinIcon className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-sm">Konum Paylaşıldı</p>
                  <p className="text-xs text-gray-400">Haritada görüntülemek için tıkla</p>
                </div>
              </div>
            ) : msg.image_url ? (
              <img
                src={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-images/${msg.image_url}`}
                alt="Resim"
               className="rounded-lg mt-4 w-48 h-48 max-w-full object-cover  shadow-sm border border-gray-200 dark:border-gray-700"              />
            ) : msg.file_url?.endsWith(".webm") ? (
                <audio controls src={msg.file_url} />
             ) : msg.file_url ? (
            <a href={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-files/${msg.file_url}`} target="_blank" rel="noopener noreferrer">
              <DocumentIcon className="w-4 h-4 mr-1" />
              {msg.content}
            </a>
          ) : (
              <p className="text-sm mt-2 leading-relaxed break-words">{msg.content}</p>
            )}

        <div className="flex mb-2"> 
            <p
              className={`text-xs mt-1.5 ${
                msg.user_id === userId ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {format(msg.created_at , "tr_TR")}
            </p>
          
            </div>
    {msg.reactions && msg.reactions.length > 0 && (
          <div className="flex space-x-1 mt-1 justify-start">
            {Object.entries(
              msg.reactions.reduce((acc: Record<string, ReactionType[]>, r) => {
                if (!acc[r.emoji]) acc[r.emoji] = [];
                acc[r.emoji].push(r);
                return acc;
              }, {})
            ).map(([emoji, reactions]) => (
              <div key={emoji} className={`relative inline-flex items-center rounded-full shadow-md ${ msg.user_id !== userId ? "bg-blue-500 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                <span className="text-sm   px-2 py-1  transition-colors">
                  {emoji}
                </span>
                {reactions.length > 1 && (
                  <span className="absolute -right-1 -bottom-2 transform -translate-x-1/4 translate-y-1/4 bg-white dark:bg-gray-800 text-black dark:text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                    {reactions.length}
                  </span>
                )}
              </div>
        ))}
      </div>
              )}

                {msg.user_id === userId && (
              <button
                onClick={() => handleMessageClick(msg)}
                className="absolute top-1 right-0 p-1 rounded-full hover:bg-blue-600/80 dark:hover:bg-gray-700 transition-colors"
                aria-label="Mesaj seçenekleri"
              >
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-200 dark:text-gray-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            )}

            {isContextMenuOpen && selectedMessage === msg && (
              <MessageContextMenu
                message={msg}
                messages={messages}
                setReplyingTo={setReplyingTo}
                onDelete={(deletedMessageId: string) => {
                  setMessages((prev) =>
                    prev.filter((m) => m.id !== deletedMessageId)
                  );
                }}
                onClose={() => setIsContextMenuOpen(false)}
              />
            )}

          </div>
        </div>
      )}) }
        <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
