"use client";
import { format } from "timeago.js";
import Image from "next/image";
import { DocumentIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
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
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };
   const handleMessageClick = (msg: Message) => {
    setSelectedMessage(msg);
    setIsContextMenuOpen((prev) => (selectedMessage === msg ? !prev : true));
  };
    useEffect(() => {
      setMessagesState(messages);
    }, [messages]);

  return (
    <div className="flex-1  p-4 overflow-y-auto space-y-4">
      {/*  en üstte oluşturulma tarihi olsun  */}
      <div className="justify-center text-center text-xs text-gray-500">
       Chat created {messagesState.length > 0 && format(messagesState[0].created_at)}  .
      </div>

      <div className=""></div>
      {messagesState.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${
            msg.user_id === userId ? "justify-end" : "items-start space-x-2"
          }`}
        >
          {msg.user_id !== userId && (
            <Image
              src={
                chatUsers.find((user) => user.id === msg.user_id)?.avatar_url ||
                "/5.jpg"
              }
              width={32}
              height={32}
              alt="avatar"
              className="rounded-full h-8 w-8 object-cover mr-2"
            />
          )}

          <div
            className={`${
              msg.user_id === userId
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-white text-gray-900 rounded-tl-none"
            } p-3 rounded-lg max-w-xs shadow relative`}
          >
            {msg.location ? (
              <div
                className="flex items-center space-x-2 mt-4 cursor-pointer hover:bg-opacity-90"
                onClick={() =>
                  openGoogleMaps(msg.location!.lat, msg.location!.lng)
                }
              >
                <MapPinIcon className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium">Konum Paylaşıldı</p>
                  <p className="text-xs">Haritada görüntülemek için tıkla</p>
                </div>
              </div>
            ) : msg.image_url ? (
              <img
                src={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-images/${msg.image_url}`}
                alt="Resim"
                className="rounded-md max-h-60 mt-4 max-w-60 object-contain"
              />
            ) : msg.file_url ? (
              <a
                href={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-files/${msg.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 mt-4 underline flex items-center"
              >
                <DocumentIcon className="w-4 h-4 mr-1" />
                {msg.content}
              </a>
            ) : (
              <p className="mt-2"> {msg.content}</p>
            )}

            <p
              className={`text-xs mt-1 ${
                msg.user_id === userId ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {format(msg.created_at)}
            </p>

                {msg.user_id === userId && (
                  <button
                    onClick={() => handleMessageClick(msg)}
                    className="absolute top-0 right-1 p-1 rounded-full hover:bg-blue-600 dark:hover:bg-gray-700"
                  >
                    <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4  dark:text-gray-300"
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
                    setMessagesState(prev => prev.filter(m => m.id !== deletedMessageId));
                  }}
                 onClose={() => setIsContextMenuOpen(false)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
