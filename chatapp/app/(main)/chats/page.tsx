"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiUsers } from "react-icons/fi";
import ChatItem from "@/app/components/ChatItem";
import SearchInput from "@/app/components/SearchInput";

type User = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

type Chat = {
  id: string;
  name: string | null;
  created_at: string;
  last_message?: {
    content: string;
    created_at: string;
  } | null;
  other_users: User[];
  unread_count?: number;
};

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchChats = async () => {
      setLoading(true);
      try {
        // 1. Kullanıcının dahil olduğu sohbetleri al
        const { data: userChats, error: chatsError } = await supabase
          .from("chat_members")
          .select(`
            chat_id,
            chats (
              id,
              name,
              created_at,
              last_message_id,
              messages:last_message_id (content, created_at)
            )
          `)
          .eq("user_id", user.id);

        if (chatsError) throw chatsError;

        // 2. Her sohbet için diğer kullanıcıları al
        const chatsWithUsers = await Promise.all(
          userChats.map(async ({ chat_id, chats }) => {
            // Sohbetteki diğer kullanıcıları getir (mevcut kullanıcı hariç)
            const { data: otherUsers } = await supabase
              .from("chat_members")
              .select(`
                users!chat_members_user_id_fkey (id, name, avatar_url)
              `)
              .eq("chat_id", chat_id)
              .neq("user_id", user.id);

            return {
              id: chats.id,
              name: chats.name,
              created_at: chats.created_at,
              last_message: chats.messages,
              other_users: otherUsers?.map(({ users }) => users) || [],
              unread_count: 0
            };
          })
        );

         // 3. Okunmamış mesaj sayılarını al
    
        const { data: unreadCounts, error: unreadError } = await supabase
          .from("user_message_status")
          .select("chat_id") 
          .eq("user_id", user.id)
          .eq("is_read", false);

           if (unreadError) {
            console.error("Okunmamış mesajlar alınamadı:", unreadError.message);
             }

        // Okunmamış mesaj sayısını hesapla
         const unreadCountMap: Record<string, number> = {};
       unreadCounts?.forEach(({ chat_id }) => {
         unreadCountMap[chat_id] = (unreadCountMap[chat_id] || 0) + 1;
      });

        // 4. Verileri birleştir
      const finalChats = chatsWithUsers.map(chat => ({
       ...chat,
     unread_count: unreadCountMap[chat.id] || 0,
        }));

        // Tarihe göre sırala (en yeni en üstte)
        finalChats.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setChats(finalChats);
      } catch (error) {
        console.error("Sohbetler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Realtime abonelik
    const subscription = supabase
      .channel("chat_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages"
        },
        () => fetchChats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);
   
// Arama çubuğu için filtreleme
const filteredChats = chats.filter(chat =>
  chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  chat.last_message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-3 text-gray-600">Sohbetler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className=" p-4 space-y-2 dark:bg-gray-800 min-h-screen">
      <div className="flex items-center justify-between mb-4 text-gray-800 dark:text-gray-200">
        <h2 className="text-xl font-semibold  flex items-center">
          <FiMessageSquare className="mr-2" /> Sohbetler
        </h2>
        {/* Arama çubuğu */}
      <SearchInput  searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      </div>

      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 ">
          <FiUsers className="text-gray-400 text-4xl mb-3" />
          <p className="text-gray-500">Henüz sohbet yok</p>
          <p className="text-gray-400 text-sm mt-1">
            Yeni bir sohbet başlatmak için bir kullanıcı arayın
          </p>
        </div>
      ) : (
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredChats.map((chat) => (
            <ChatItem key={chat.id} chat={chat} onClick={() => router.push(`/chats/${chat.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;