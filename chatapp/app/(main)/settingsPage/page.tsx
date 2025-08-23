"use client";
import React, {  useState } from "react";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemaContext";
import Friends from "./components/Friends";
import Blocked from "./components/Blocked";
import { toast } from "react-toastify";
import { supabase } from "@/app/lib/supabaseClient";
 import {FriendsProps} from "../../../types/contactUser";
import { useUser } from "@/app/context/UserContext";

type Theme = "light" | "dark";

function SettingsPage() {
  const router = useRouter(); 
   const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("tr");
  const [openFriendsState,setOpenFriendsState] = useState(false);
  const [openBlockedState,setOpenBlockedState] = useState(false);
  const [blocked,setBlocked]=useState<FriendsProps[]>([]);
  const [friends,setFriends]=useState<FriendsProps[]>([]);

  const handleBlock = async (id: string) => {
    if (!user?.id) return;
  const isBlocked = blocked.some(b => b.contact_id === id);

  const { error } = await supabase
    .from("contacts")
    .update({ is_blocked: !isBlocked })
    .eq("contact_id", id).eq("owner_id", user?.id);

  if (error) {
    toast.error("Kullanıcı engellenirken hata oluştu");
    return;
  }

  if (isBlocked) {
    const userToUnblock = blocked.find(b => b.contact_id === id);
    setBlocked(prev => prev.filter(b => b.contact_id !== id));

    if (userToUnblock) {
      setFriends(prev => [...prev, { ...userToUnblock, is_blocked: false }]);
    }

    toast.success("Kullanıcı engeli kaldırıldı");
  } else {
    const userToBlock = friends.find(f => f.contact_id === id);
    if (userToBlock) {
      setFriends(prev => prev.filter(f => f.contact_id !== id));
      setBlocked(prev => [...prev, { ...userToBlock, is_blocked: true }]);
    }
    toast.success("Kullanıcı engellendi");
  }
};

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Geri Butonu */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 dark:text-indigo-400 mb-6 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          Geri
        </button>

        {/* Başlık */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Ayarlar
        </h1>
        
        {/* Hesap Ayarları */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center mb-4">
            <UserIcon className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Hesap Ayarları
            </h2>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={()=>setOpenFriendsState(true)}
              className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <span>Arkadaş Listesi</span>
              <span className="text-indigo-600 dark:text-indigo-400">Yönet</span>
            </button>
            
            <button 
              onClick={()=>setOpenBlockedState(true)}
              className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <span>Engellenen Kullanıcılar</span>
              <span className="text-indigo-600 dark:text-indigo-400">Yönet</span>
            </button>
          </div>
          {openFriendsState && (
            <Friends friends={friends} handleBlock={handleBlock}  setFriends={setFriends} setOpenFriendsState={setOpenFriendsState}/>
          )}
          {openBlockedState && (
            <Blocked blocked={blocked} handleBlock={handleBlock} setBlocked={setBlocked} setOpenBlockedState={setOpenBlockedState}/>
          )}

        </div>
        
        {/* Tema Ayarları */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Tema Ayarları
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Tema Seçimi
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}  
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              >
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dil Ayarları */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Dil Ayarları
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Dil Seçimi
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;