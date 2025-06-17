"use client";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline"; // Kapatma ikonu için
import Image from "next/image";

const dummyUsers = [
  { id: 1, name: "Hakan", email: "hakan@example.com" },
  { id: 2, name: "Ayşe", email: "ayse@example.com" },
  { id: 3, name: "Mehmet", email: "mehmet@example.com" },
];

interface UsersProps {
  setOpenUsers: (open: boolean) => void;
}

const Users = ({ setOpenUsers }: UsersProps) => {
  // Dışa tıklama ile kapanma için handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenUsers(false);
    }
  };

  // Kullanıcı seçimi handler'ı (modalı kapatır ve seçimi aktarır)
  const handleUserSelect = (userId: number) => {
    console.log("Seçilen kullanıcı ID:", userId);
    setOpenUsers(false); 
  };

  return (
<div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-xl shadow-lg p-4 md:p-6 w-full max-w-md mx-auto transform translate-y-[-10%] md:translate-y-0">
        {/* Kapatma Butonu */}
        <button
          onClick={() => setOpenUsers(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Başlık ve Ayırıcı */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Kullanıcı Seç</h3>
        <div className="border-b border-gray-200 mb-4"></div>

        {/* Kullanıcı Listesi */}
        <ul className="space-y-3 max-h-[70vh] overflow-y-auto">
          {dummyUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className="p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition cursor-pointer flex items-center justify-between"
            >
             <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                  <Image
                    src={`/avatars/${user.id}.jpg`} 
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className="text-indigo-600 font-medium">Seç</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;