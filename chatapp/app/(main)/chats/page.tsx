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
    user_id?: string;
  } | null;
  other_users: User[];
  unread_count?: number;
};

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const fetchChats = async () => {
      setLoading(true);
      try {
        const { data: userChats, error: chatsError } = await supabase
          .from("chat_members")
          .select(`
            chat_id,
            chats (
              id,
              name,
              created_at,
              last_message_id,
              messages:last_message_id (content, created_at,user_id)
            )
          `)
          .eq("user_id", user.id);

        if (chatsError) throw chatsError;
        if (!userChats || userChats.length === 0) {
          setChats([]);
          return;
        }
     
        const { data: blockedData } = await supabase
          .from("contacts")
          .select("contact_id")
          .eq("is_blocked", true)
          .eq("owner_id", user.id);

        const { data: blockedByData } = await supabase
          .from("contacts")
          .select("owner_id")
          .eq("is_blocked", true)
          .eq("contact_id", user.id);

        const ids = [
          ...(blockedData?.map(b => b.contact_id) || []),
          ...(blockedByData?.map(b => b.owner_id) || [])
        ];
        const currentBlockedIds = ids.filter(id => id !== undefined);

          setBlockedIds(currentBlockedIds);

        const chatsWithUsers = await Promise.all(
          userChats.map(async ({ chat_id, chats }) => {
            const { data: otherUsers } = await supabase
              .from("chat_members")
              .select(`
                users!chat_members_user_id_fkey1 (id, name, avatar_url)
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
    
        const { data: unreadCounts, error: unreadError } = await supabase
          .from("user_message_status")
          .select("chat_id ,message_id,messages!inner(user_id)") 
          .eq("user_id", user.id)
          .eq("is_read", false);    

           if (unreadError) {
            console.error("Okunmamış mesajlar alınamadı:", unreadError.message);
             }
                const filteredUnreadCounts =
              unreadCounts?.filter(
            (u) => !currentBlockedIds.includes(u.messages?.user_id)
          ) || [];

         const unreadCountMap: Record<string, number> = {};
       filteredUnreadCounts?.forEach(({ chat_id }) => {
         unreadCountMap[chat_id] = (unreadCountMap[chat_id] || 0) + 1;
      });

      const finalChats = chatsWithUsers.map(chat => {
          const lastMessageUserId = chat.last_message?.user_id;
          const isBlocked = lastMessageUserId && currentBlockedIds.includes(lastMessageUserId);

            return {
            ...chat,
           unread_count: isBlocked ? 0 : (unreadCountMap[chat.id] || 0),
           is_blocked: isBlocked 
          };
        });

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
   
const filteredChats = chats.filter(chat =>
  chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  chat.last_message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className=" p-4 space-y-2 bg-gray-100 dark:bg-gray-800 min-h-screen">
   
   {loading ? (
      <div className="p-4 flex flex-col items-center justify-center h-64 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-3 text-gray-600 dark:text-gray-300">Sohbetler yükleniyor...</p>
      </div>
    ) :
      chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm">
          <FiUsers className="text-gray-400 dark:text-gray-300 text-5xl mb-3" />
          <p className="text-gray-500">Henüz sohbet yok</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Yeni bir sohbet başlatmak için bir kullanıcı arayın
          </p>
        </div>
      ) : (
        <>
           <div className="flex items-center justify-between mb-4 text-gray-800 dark:text-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center">
          <FiMessageSquare className="mr-2 w-6 h-6" /> Sohbetler
        </h2>

      <SearchInput  searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm">
          {filteredChats.map((chat) => (
            <ChatItem key={chat.id} blockedIds={blockedIds}  chat={chat} onClick={() => router.push(`/chats/${chat.id}`)} />
          ))}
        </div></>
      )}
    </div>
  );
};

export default ChatList;