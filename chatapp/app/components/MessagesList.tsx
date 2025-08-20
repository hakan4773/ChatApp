"use client";
import { format } from "timeago.js";
import Image from "next/image";
import { DocumentIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import MessageContextMenu from "./MessageContextMenu";

interface Message {
  id: string;
  content: string;
  user_id: string;
  avatar_url: string;
  location?: {
    lat: number;
    lng: number;
  } | null;
  file_url: string | null;
  image_url: string;
  created_at: string;
}

interface MessagesListProps {
  messages: Message[];
  userId: string | undefined;
  chatUsers: {
    id: string;
    avatar_url: string | null;
  }[];
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  userId,
  chatUsers,
}) => {
  const [messagesState, setMessagesState] = useState<Message[]>(messages);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
   const chatRef = useRef<HTMLDivElement>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };
   const handleMessageClick = (msg: Message) => {
    setSelectedMessage(msg);
    setIsContextMenuOpen((prev) => (selectedMessage === msg ? !prev : true));
  };
 const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessagesState(messages);
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesState]); 

 
  useEffect(() => {
    scrollToBottom();
  }, []);


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
      {messagesState.length > 0 && (
        <div className="flex justify-center">
          <span className="inline-block px-4 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 rounded-full shadow">
            {new Date(messagesState[0].created_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      )}

      {messagesState.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${
            msg.user_id === userId ? "justify-end" : "items-start space-x-3"
          }`}
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

          <div
            className={`relative p-3 rounded-2xl max-w-sm shadow-md transition-all duration-200 ${
              msg.user_id === userId
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-tl-none"
            }`}
          >
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
            ) : msg.file_url ? (
              <a
                href={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-files/${msg.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 mt-4 dark:text-blue-300 underline flex items-center text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                <DocumentIcon className="w-4 h-4 mr-1" />
                {msg.content}
              </a>
            ) : (
              <p className="text-sm mt-2 leading-relaxed">{msg.content}</p>
            )}

            <p
              className={`text-xs mt-1.5 ${
                msg.user_id === userId ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {format(msg.created_at, "tr_TR")}
            </p>

            {msg.user_id === userId && (
              <button
                onClick={() => handleMessageClick(msg)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-600/80 dark:hover:bg-gray-700 transition-colors"
                aria-label="Mesaj seçenekleri"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-200 dark:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            )}

            {isContextMenuOpen && selectedMessage === msg && (
              <MessageContextMenu
                message={msg}
                onDelete={(deletedMessageId: string) => {
                  setMessagesState((prev) =>
                    prev.filter((m) => m.id !== deletedMessageId)
                  );
                }}
                onClose={() => setIsContextMenuOpen(false)}
              />
            )}
          </div>
        </div>
      ))}
        <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
