"use client";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

interface OpenProps {
  setOpenUsers: (open: boolean) => void;
  onCreateChat: (selectedUsers: string[]) => void;
}
interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

const Users = ({ setOpenUsers,onCreateChat }: OpenProps) => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  //Kullanıcıları getir
  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) {
          console.error("Kullanıcı bulunamadı", error);
          return;
        } else {
          setUsers(data as UserProps[]);
        }
      } catch (error) {
        console.error("hata oluştu", error);
      }
    };
    getUsers();
  }, []);

  //Çoklu kullanıcı seçimi
  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Dışa tıklama ile kapanma için handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenUsers(false);
    }
  };
  const handleCreateGroupChat = () => {
    if (selectedUsers.length > 0) {
      onCreateChat(selectedUsers); // Seçilen kullanıcıları üst bileşene ilet
    } else {
      console.log("Lütfen en az bir kullanıcı seçin.");
    }
  };

  return (
    <div
      className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
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
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Kullanıcı Seç
        </h3>
        <div className="border-b border-gray-200 mb-4"></div>

        {/* Kullanıcı Listesi */}
        <ul className="space-y-3 max-h-[70vh] overflow-y-auto">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className={`p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition cursor-pointer flex items-center justify-between ${
                selectedUsers.includes(user.id)
                  ? "border-2 border-indigo-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                  <Image
                    src={
                      user.avatar_url ? user.avatar_url : `/avatars/default.jpg`
                    }
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/avatars/default.jpg";
                    }}
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span
                className={`text-indigo-600 font-medium ${
                  selectedUsers.includes(user.id)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
              >
                {selectedUsers.includes(user.id) ? "Seçili" : "Seç"}
              </span>{" "}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
             onClick={handleCreateGroupChat}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            disabled={selectedUsers.length === 0}
          >
            Grup Sohbeti Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
