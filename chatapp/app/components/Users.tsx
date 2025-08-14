"use client";
import React, {useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import AddChatName from "./AddChatName";
import AddNewUsers from "./AddNewUsers";
import { useUser } from "../context/UserContext";
import { UserProps ,OpenProps} from "../../types/ContactUser";

const Users = ({ setOpenUsers,onCreateChat,name,setName }: OpenProps) => {
  const {user}=useUser();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openNameState, setOpenNameState] = useState<boolean>(false);
  const [openNewUsers, setOpenNewUsersState] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
         const { data, error } = await supabase
        .from("contacts")
         .select(`
    contact_id,
    nickname,
    email,
    users!contacts_contact_id_fkey1 (
      id,
      name,
      email,
      avatar_url
    )
  `).eq("owner_id", user?.id);       
  
       
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
  }, [user]);

    const handleUserAdded = (newUser: UserProps) => {
       setUsers((prev) => [...prev, newUser]);
      };


  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenUsers(false);
    }
  };
  const handleCreateGroupChat = () => {
    if (selectedUsers.length > 0) {
      onCreateChat(selectedUsers);
    } else {
      console.log("Lütfen en az bir kullanıcı seçin.");
    }
  };

  const handleOpenName = () => {
    if (selectedUsers.length > 0) {
      setOpenNameState(true);
    } else {
      console.log("Lütfen en az bir kullanıcı seçin.");
    }
  };

  const handleNewUser = () => {
    setOpenNewUsersState(true);
  };
  return (
    <div
      className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 w-full max-w-md mx-auto transform translate-y-[-10%] md:translate-y-0">
        <button
          onClick={() => setOpenUsers(false)}
          className="absolute top-3 right-3 text-gray-400  hover:text-red-500 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex justify-between ">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Kullanıcı Seç
        </h3>
        <button onClick={handleNewUser} className="mr-6 bg-indigo-600 mb-4 text-white hover:bg-indigo-700 transition-colors rounded-md shadow-sm p-2">
          Yeni Kullanıcı Ekle
        </button>
         {openNewUsers && (
            <AddNewUsers onUserAdded={handleUserAdded} setOpenUsers={setOpenNewUsersState}  />
          )} 
      </div>
                
       <div className="border-b border-gray-200 mb-4"></div>

        <ul className="max-h-64 overflow-y-auto space-y-2">
          {users.map((user,index) => (
            <li
              key={`${user.id}-${index}`}
              onClick={() => handleUserSelect(user.users.id)}
              className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition cursor-pointer flex items-center justify-between ${
                selectedUsers.includes(user.users.id)
                  ? "border-2 border-indigo-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                  <Image
                    src={user.avatar_url ? user.avatar_url : `/5.jpg`}
                    alt={user.nickname}
                    width={40}
                    height={40}
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/5.jpg";
                    }}
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-medium dark:text-gray-200">{user.nickname}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
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
            onClick={handleOpenName}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            disabled={selectedUsers.length === 0}
          >
            Grup Sohbeti Oluştur
          </button>

          {openNameState && (
            <AddChatName
              setOpenNameState={setOpenNameState}
              handleCreateGroupChat={handleCreateGroupChat}
              name={name}
              setName={setName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
