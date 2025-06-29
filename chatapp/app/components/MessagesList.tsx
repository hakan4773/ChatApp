"use client";
import { format } from "timeago.js";
import Image from "next/image";
import { DocumentIcon, MapPinIcon } from "@heroicons/react/24/outline";

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

const MessagesList: React.FC<MessagesListProps> = ({ messages, userId, chatUsers }) => {
  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${msg.user_id === userId ? "justify-end" : "items-start space-x-2"}`}
        >
          {msg.user_id !== userId && (
            <Image
              src={chatUsers.find((user) => user.id === msg.user_id)?.avatar_url || "/5.jpg"}
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
            } p-3 rounded-lg max-w-xs shadow`}
          >
            {/* Konum mesajı */}
            {msg.location ? (
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:bg-opacity-90"
                onClick={() => openGoogleMaps(msg.location!.lat, msg.location!.lng)}
              >
                <MapPinIcon className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium">Konum Paylaşıldı</p>
                  <p className="text-xs">Haritada görüntülemek için tıkla</p>
                </div>
              </div>
            ) : 
            /* Resim mesajı */
            msg.image_url ? (
              <img
                src={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-images/${msg.image_url}`}
                alt="Resim"
                className="rounded-md max-h-60 max-w-60 object-contain"
              />
            ) : 
            /* Dosya mesajı */
            msg.file_url ? (
              <a
                href={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-files/${msg.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center"
              >
                <DocumentIcon className="w-4 h-4 mr-1" />
                {msg.content}
              </a>
            ) : 
            /* Normal metin mesajı */
            (
              <p>{msg.content}</p>
            )}
            
            <p className={`text-xs mt-1 ${
              msg.user_id === userId ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {format(msg.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;