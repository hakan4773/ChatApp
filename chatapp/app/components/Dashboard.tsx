"use client";
import { useUser } from "@/app/context/UserContext";
import {  ChatBubbleLeftIcon, DocumentArrowUpIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Users from "../components/Users"
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";


 function dashboard() {
 const {user}=useUser();
 const router=useRouter();
const [openUsers,setOpenUsers]=useState<boolean>(false)
const [name, setName] = useState<string>("");
const [activeChats, setActiveChats] = useState<number>(0);
const [sharedFiles, setSharedFiles] = useState<number>(0);
const handleCreateChat=async(selectedUsers:string [])=>{
  if(!user?.id){
    console.error("Kullanıcı kimliği bulunamadı.");
      return;
  }
const currentUserId = user.id; //mevcut kullanıcı id'si 
const allUserIds = [currentUserId, ...selectedUsers];//eklenecek kullanıcıların listesi

try {
      // Mevcut sohbet kontrolü
      const { data: chatMembers, error: fetchError } = await supabase
        .from("chat_members")
        .select("chat_id, user_id");

      if (fetchError) throw fetchError;

      // Aynı üyelerden oluşan bir sohbet var mı kontrol et
      let chatId: string | undefined;
      if (chatMembers && chatMembers.length > 0) {
        // chat_id'ye göre grupla
        const chatGroups: { [key: string]: string[] } = {};
        chatMembers.forEach((member: any) => {
          if (!chatGroups[member.chat_id]) {
            chatGroups[member.chat_id] = [];
          }
          chatGroups[member.chat_id].push(member.user_id);
        });

        // Tüm kullanıcıları içeren sohbeti bul
        const foundChat = Object.entries(chatGroups).find(
          ([, members]) =>
            members.length === allUserIds.length &&
            allUserIds.every((id) => members.includes(id))
        );
        if (foundChat) {
          chatId = foundChat[0];
        }
      }

      if (!chatId) {
        // Yeni sohbet oluştur
        const { data: newChat, error: insertChatError } = await supabase
          .from("chats")
          .insert({ created_at: new Date().toISOString(),
            name: name || "Yeni Sohbet", 
           })
          .select("id")
          .single();

        if (insertChatError) throw insertChatError;

        chatId = newChat.id;

        // chat_members'a kayıtlar ekle
        const membersToInsert = allUserIds.map((userId) => ({
          chat_id: chatId,
          user_id: userId,
          joined_at: new Date().toISOString(),
        }));

        const { error: insertMembersError } = await supabase
          .from("chat_members")
          .insert(membersToInsert);

        if (insertMembersError) throw insertMembersError;
      }

      // Sohbet sayfasına yönlendir
      if (chatId) {
        router.push(`/chats/${chatId}`);
      }
    } catch (error) {
      console.error("Sohbet oluşturma hatası:", error);
      alert("Sohbet oluşturulamadı, lütfen tekrar deneyin.");
    }
  };
  
  //İstatistiksel verileri almak için gerekli fonksiyon
useEffect(() => {
  const fetchChatStats = async () => {
    if (!user?.id) return;

    try {
      // Aktif sohbet sayısını al
      const { data: activeChats, error: activeChatsError } = await supabase
        .from("chat_members")
        .select("chat_id")
        .eq("user_id", user.id);

      if (activeChatsError) throw activeChatsError;
        setActiveChats(activeChats.length);
        
      // Paylaşılan dosya sayısını al
      const { data: sharedFiles, error: sharedFilesError } = await supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .not("file_url", "is", null); 

      if (sharedFilesError) throw sharedFilesError;
         setSharedFiles(sharedFiles.length);

      // Yeni bildirim sayısını al
      // const { data: notifications, error: notificationsError } = await supabase
      //   .from("notifications")
      //   .select("*")
      //   .eq("user_id", user.id)
      //   .eq("is_read", false);

      // if (notificationsError) throw notificationsError;
    } catch (error) {
      console.error("İstatistik verileri alınamadı:", error);
    }
    }
    fetchChatStats();
  }, [user]);

const handleOpen=()=>{
  setOpenUsers(!openUsers)
}
  return (
   
    <div className="min-h-screen  flex relative">
      <div className="flex-1 flex flex-col">

        {/* Dashboard İçeriği */}
        <div className="flex-1 p-6 ">
          <div className="max-w-4xl mx-auto">
            {/* Hoş Geldin Mesajı */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold ">Merhaba, {user?.user_metadata.name}!</h2>
              <p className="text-gray-500 mt-2">
                ChatApp'e hoş geldiniz! Yeni bir sohbete başlayın veya dosyalarınızı paylaşın.
              </p>
            </div>

            {/* Hızlı Erişim Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Kart 1: Yeni Sohbet */}
              <button
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-indigo-50"
                onClick={handleOpen}
              >
                
                <ChatBubbleLeftIcon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">Yeni Sohbet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Arkadaşlarınızla anında sohbete başlayın.
                </p>
              </button>
{
  openUsers && 
<Users setOpenUsers={setOpenUsers} onCreateChat={handleCreateChat} name={name} setName={setName} />

}
     {/* Kart 2: Notlarım */}

        <Link
          href="/notes"
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-indigo-50"
           >
           <DocumentArrowUpIcon className="w-10 h-10 text-indigo-600 mb-4" />
             <h3 className="text-lg font-medium text-gray-800">Notlarım</h3>
             <p className="text-sm text-gray-500 mt-1">
            Kişisel notlarınızı kaydedin ve düzenleyin.
          </p>
         </Link>

              {/* Kart 3: Profili Görüntüle */}
              <Link
                href="/profiles"
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-indigo-50"
              >
                <UserCircleIcon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">Profil</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Profil bilgilerinizi düzenleyin.
                </p>
              </Link>
            </div>

            {/* Özet Alanı */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hızlı Özet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">{activeChats}</p>
                  <p className="text-sm text-gray-500">Aktif Sohbet</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">{sharedFiles}</p>
                  <p className="text-sm text-gray-500">Paylaşılan Dosya</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">3</p>
                  <p className="text-sm text-gray-500">Yeni Bildirim</p>
                </div>
              </div>
            </div>  
            
            </div>
            </div>
            </div>
            </div>);
}

export default dashboard;
