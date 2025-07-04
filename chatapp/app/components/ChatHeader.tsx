"use client";
import { InformationCircleIcon, TrashIcon, BellSlashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

interface ChatHeaderProps {
  chatInfo: {
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
    created_at: string;
  }[];
  openSettings: boolean;
  handleSettings: () => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleLeaveGroup: () => void;
  setShowInfoModal: (value: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatInfo,
  members,
  openSettings,
  handleSettings,
  handleOverlayClick,
  handleLeaveGroup,
  setShowInfoModal,
}) => {
  return (
    <div className="bg-blue-500 text-white p-4 flex items-center justify-between shadow-md relative" onClick={handleOverlayClick}>
      <div className="flex items-center space-x-3">
        <Image
          src={chatInfo?.users[0]?.avatar_url || "/5.jpg"}
          width={40}
          height={40}
          alt="avatar"
          className="rounded-full object-cover border-2 border-white"
        />
        <div>
          <h1 className="font-bold">{chatInfo?.name}</h1>
          <div className="flex">
            {members.map((member, index) => (
              <p key={index} className="text-xs text-blue-100">
                {member.name},
              </p>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSettings} className="p-2 rounded-full hover:bg-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {openSettings && (
        <div className="absolute flex flex-col border p-2 space-y-3 z-50 top-9 bg-gray-50 border-gray-50 text-gray-500 right-8 rounded-md">
          <button className="hover:bg-gray-100 flex space-x-2 items-center" onClick={() => setShowInfoModal(true)}>
            <InformationCircleIcon className="h-4 w-4 text-gray-500" />
            <span>Bilgi</span>
          </button>
          <button className="hover:bg-gray-100 flex space-x-2 items-center">
            <BellSlashIcon className="h-4 w-4 text-gray-500" />
            <span>Sessize Al</span>
          </button>
          <button onClick={handleLeaveGroup} className="hover:bg-gray-100 flex space-x-2 items-center">
            <TrashIcon className="h-4 w-4 text-gray-500" />
            <span>Gruptan Çık</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
