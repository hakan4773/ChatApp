"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  UserCircleIcon,
  CogIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  PuzzlePieceIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";

type LeftBarProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

function LeftBar({ setIsOpen, isOpen }: LeftBarProps) {
  const { user, signOut, loading } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
   
  if( loading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-16 bg-white border-r shadow flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-0 left-0 h-screen ${
        isOpen ? "w-64" : "w-16"
      } bg-white border-r shadow transition-all duration-300 flex flex-col justify-between z-50`}
    >
      {/* Üst Kısım */}
      <div>
        {/* Toggle Butonu */}
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Menü Elemanları */}
        <nav className="flex flex-col gap-2 px-2">
           <MenuLink
  href="/"
  icon={
    <img
      src={user?.user_metadata.avatar_url || "/5.jpg"} alt="Profile" className="w-6 h-6 rounded-full border-2 border-indigo-500" />} label="Profil" isOpen={isOpen}
/>
          <MenuLink href="/chats" icon={<UsersIcon className="w-6 h-6" />} label="Sohbetler" isOpen={isOpen} />
          <MenuLink href="/games" icon={<PuzzlePieceIcon className="w-6 h-6" />} label="Oyunlar" isOpen={isOpen} />
          <MenuLink href="/settings" icon={<CogIcon className="w-6 h-6" />} label="Ayarlar" isOpen={isOpen} />
          <MenuLink href="/help" icon={<QuestionMarkCircleIcon className="w-6 h-6" />} label="Yardım" isOpen={isOpen} />
          <MenuLink href="/notifications" icon={<BellIcon className="w-6 h-6" />} label="Bildirimler" isOpen={isOpen} />
        </nav>
      </div>

      {/* Alt Çıkış Butonu */}
      <div className="px-2 mb-4 space-y-2">
    
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 text-red-600 transition-colors w-full"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          {isOpen && <span className="font-medium">Çıkış Yap</span>}
        </button>
        </div>
    </div>
  );
}

// Menü Link Bileşeni
type MenuLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
};

const MenuLink: React.FC<MenuLinkProps> = ({ href, icon, label, isOpen }) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 text-gray-700 transition-colors"
  >
    {icon}
    {isOpen && <span className="font-medium">{label}</span>}
  </Link>
);

export default LeftBar;
