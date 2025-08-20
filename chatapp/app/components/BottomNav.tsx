"use client";

import Link from "next/link";
import React from "react";
import {
  UserCircleIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";


const BottomNav = () => {
  const router = useRouter();
  const { user ,signOut} = useUser();
  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 shadow-md z-50">
      <nav className="flex justify-around items-center py-2">
        <MenuLink
          href="/"
          icon={
            <img
              src={user?.user_metadata.avatar_url || "/5.jpg"}
              alt="Profile"
              className="w-7 h-7 rounded-full border-2 border-indigo-500 dark:border-indigo-400"
            />
          }
          label="Profil"
        />
        <MenuLink
          href="/chats"
          icon={<UsersIcon className="w-7 h-7" />}
          label="Sohbetler"
        />
        <MenuLink
          href="/chat_notifications"
          icon={<BellIcon className="w-7 h-7" />}
          label="Bildirimler"
        />
        <MenuLink
          href="/settingsPage"
          icon={<CogIcon className="w-7 h-7" />}
          label="Ayarlar"
        />
         <MenuLink
          icon={<ArrowRightOnRectangleIcon className="w-7 h-7 text-red-500" />}
          label="Çıkış"
          onClick={handleSignOut} 
        />
      </nav>
    </div>
  );
};

// Menü Link Bileşeni
type MenuLinkProps = {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const MenuLink: React.FC<MenuLinkProps> = ({ href, icon, label, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center p-4 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-600 active:bg-indigo-200 dark:active:bg-indigo-500 transition-colors"
      >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={href!}
      className="flex flex-col items-center p-4 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-600 active:bg-indigo-200 dark:active:bg-indigo-500 transition-colors"
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </Link>
  );
};


export default BottomNav;