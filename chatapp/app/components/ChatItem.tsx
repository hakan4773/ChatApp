
import Image from "next/image";
import { FiUsers } from "react-icons/fi";

type User = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

type LastMessage = {
  content: string;
  created_at: string;
  user_id?: string;
};

type Chat = {
  id: string;
  name: string | null;
  created_at: string;
  last_message?: LastMessage | null;
  other_users: User[];
  unread_count?: number;
  is_blocked?: boolean; 
};

type ChatItemProps = {
  chat: Chat;
   blockedIds?: string[];
  onClick: () => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatItem = ({ chat,blockedIds, onClick }: ChatItemProps) => {
const isMessageBlocked = chat.is_blocked; 
const getMessageContent = () => {
    if (!chat.last_message) return "Sohbet başlatıldı";
    if (isMessageBlocked) return "Engellenen kullanıcıdan mesaj";
    return chat.last_message.content;
};
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3  hover:bg-gray-50 hover:dark:bg-gray-700 cursor-pointer transition`}
    >
      <div className="relative mr-3">
        {chat.other_users.length > 0 ? (
          <Image
            src={chat.other_users[0]?.avatar_url || "/5.jpg"}
            alt="Avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <FiUsers className="text-gray-400 text-xl" />
          </div>
        )}
        {(chat.unread_count ?? 0) > 0 && !isMessageBlocked && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {chat.unread_count ?? 0} <span className="sr-only">okunmamış mesaj</span>
          </span>
        )}
       
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-semibold  dark:text-gray-200 truncate">
            {chat.name || chat.other_users.map((u) => u.name).join(", ")}
          </h3>
          {chat.last_message && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
              {formatDate(chat.last_message.created_at)}
            </span>
          )}
        </div>
        {chat.last_message ? (
          <p className="text-sm text-gray-500 truncate">
            {getMessageContent()}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">Sohbet başlatıldı</p>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
