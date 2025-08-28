"use client";
import { FriendsProps } from "@/types/contactUser";
import { InformationCircleIcon, TrashIcon, BellSlashIcon, BellIcon, ArrowLeftIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  chatInfo: {
    id: string;
    name: string | null;
    users: {
      id: string;
      name: string | null;
      avatar_url: string | null;
    }[];
  } | null;
  members: {
    id: string;
    name: string;
    avatar_url: string;
    email: string;  
    created_at: string;
  }[];
  openSettings: boolean;
  contacts:FriendsProps[];
  handleSettings: () => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleLeaveGroup: () => void;
  setOpenSettings: (open: boolean) => void;
  setShowInfoModal: (value: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatInfo,
  members,
  contacts,
  openSettings,
  setOpenSettings,
  handleSettings,
  handleOverlayClick,
  handleLeaveGroup,
  setShowInfoModal,
}) => {
  const { user } = useUser();
    const router = useRouter();

  const [isMuted, setIsMuted] = useState(false);
  const [isOnline, setIsOnline] = useState(false); 

  useEffect(() => {
    const fetchMuteStatus = async () => {
      if (!chatInfo || !user) return;

      const { data, error } = await supabase
        .from("chat_members")
        .select("is_muted")
        .eq("chat_id", chatInfo.id)
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setIsMuted(data.is_muted);
      }
    };

    fetchMuteStatus();
  }, [chatInfo, user]);

  const handleToggleMute = async () => {
    if (!chatInfo || !user) return;

    const chatId = chatInfo.id;
    const newMuteStatus = !isMuted;

    const { error } = await supabase
      .from("chat_members")
      .update({ is_muted: newMuteStatus })
      .eq("chat_id", chatId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Mute güncellenemedi:", error.message);
    } else {
      setIsMuted(newMuteStatus);
      toast.success(
        newMuteStatus ? "Sessiz mod aktif edildi." : "Sessiz mod kapatıldı."
      );
    }
  };
  const isGroupChat = members.length > 2;
  return (
    <div
      className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-gray-800 dark:to-gray-700 text-white p-4 flex items-center justify-between shadow-md relative"
      onClick={handleOverlayClick}
    >
   <button
      onClick={() => router.back()}
      className="p-2 block  md:hidden rounded-full hover:bg-blue-500/30 dark:hover:bg-gray-700 transition"
    >
      <ArrowLeftIcon className="w-6 h-6 text-white dark:text-gray-200" />
    </button>
        <div className="flex items-center space-x-4">
        <Image
          src={chatInfo?.users[0]?.avatar_url || "/5.jpg"}
          width={48}
          height={48}
          alt="avatar"
          className="rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
        />
        <div>
          <h1 className="font-semibold ">{chatInfo?.name || members.map((u) => u.id !== user?.id ? u.name : "")}</h1>
          <div className="flex items-center">
            {isGroupChat ? (
              <>
                <UserGroupIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {members.length} üye
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isOnline ? "Çevrimiçi" : "Çevrimdışı"}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSettings}
        className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-gray-600 transition-colors"
        aria-label="Ayarlar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-100 dark:text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {openSettings && (
        <div className="absolute flex flex-col border p-2 space-y-2 z-50 top-14 right-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-lg w-48">
          {/* Bilgi */}
          <button
            className="flex space-x-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => {
              setShowInfoModal(true)
              setOpenSettings(false)
            }

            }
          >
            <InformationCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span>Bilgi</span>
          </button>

          {/* Sessize al */}
          <button
            onClick={handleToggleMute}
            className="flex space-x-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isMuted ? (
              <BellSlashIcon className="h-5 w-5 text-red-400" />
            ) : (
              <BellIcon className="h-5 w-5 text-green-400" />
            )}
            <span>{isMuted ? "Sessizden Çıkar" : "Sessize Al"}</span>
          </button>

          {/* Gruptan çık */}
          <button
            onClick={handleLeaveGroup}
            className="flex space-x-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Gruptan Çık</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default ChatHeader;
