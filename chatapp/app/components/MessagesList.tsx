"use client";
import { format } from "timeago.js";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  user_id: string;
  avatar_url: string;
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
                ? "bg-blue-500 my-1 text-white rounded-tr-none"
                : "bg-white text-gray-900 rounded-tl-none"
            } p-3 rounded-lg max-w-xs shadow`}
          >
            {msg.image_url ? (
              <img
                src={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-images/${msg.image_url}`}
                alt="Resim"
                className="rounded-md max-h-60 max-w-60 object-contain"
              />
            ) : msg.file_url ? (
              <a
                href={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-files/${msg.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {msg.content}
              </a>
            ) : (
              <p>{msg.content}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">{format(msg.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
