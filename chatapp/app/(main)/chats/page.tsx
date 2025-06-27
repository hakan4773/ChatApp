"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiUsers } from "react-icons/fi";

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
              other_users: otherUsers?.map(({ users }) => users) || []
            };
          })
        );

        // 3. Okunmamış mesaj sayılarını al
        const { data: unreadCounts } = await supabase
          .rpc("get_unread_message_counts", { current_user_id: user.id });

        // 4. Verileri birleştir
        const finalChats = chatsWithUsers.map(chat => ({
          ...chat,
          unread_count: unreadCounts?.find((c:any) => c.chat_id === chat.id)?.count || 0
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-3 text-gray-600">Sohbetler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FiMessageSquare className="mr-2" /> Sohbetler
        </h2>
      </div>

      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FiUsers className="text-gray-400 text-4xl mb-3" />
          <p className="text-gray-500">Henüz sohbet yok</p>
          <p className="text-gray-400 text-sm mt-1">
            Yeni bir sohbet başlatmak için bir kullanıcı arayın
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => router.push(`/chats/${chat.id}`)}
              className={`flex items-center p-3 bg-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                chat.unread_count ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative mr-3">
                {chat.other_users.length > 0 ? (
                  <Image
                    src={chat.other_users[0]?.avatar_url || "/5.jpg"}
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUsers className="text-gray-400 text-xl" />
                  </div>
                )}
                {(chat.unread_count ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unread_count ?? 0}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {chat.name || chat.other_users.map(u => u.name).join(", ")}
                  </h3>
                  {chat.last_message && (
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {formatDate(chat.last_message.created_at)}
                    </span>
                  )}
                </div>
                {chat.last_message ? (
                  <p className="text-sm text-gray-500 truncate">
                    {chat.last_message.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Sohbet başlatıldı</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;