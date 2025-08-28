"use client";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { leaveChat } from "../../../utils/leaveChat";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InformationModal from "../../../components/InformationModal";
import { playMessageSound } from "@/app/utils/sound";
import MessageInput from  "../../../components/MessageInput";
import ChatHeader from "../../../components/ChatHeader";
import MessagesList from "../../../components/MessagesList";
import { FriendsProps } from "@/types/contactUser";
import { notifyUsers } from "@/app/utils/NotifyUsers";
import { ChatInfoType, MembersType, MessageType } from "@/types/message";
import { RealtimeChannel } from '@supabase/supabase-js';

const Page = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const params = useParams();
  const chatId = params?.id as string;

  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState<MembersType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<ChatInfoType | null>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [contacts, setContacts] = useState<FriendsProps[]>([]);
  const [blockedByMe, setBlockedByMe] = useState<FriendsProps[]>([]);
  const [blockedMe, setBlockedMe] = useState<FriendsProps[]>([]);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const blockedRef = useRef({ blockedByMe, blockedMe });

  // 🔹 blockedRef güncellemesi
  useEffect(() => {
    blockedRef.current = { blockedByMe, blockedMe };
  }, [blockedByMe, blockedMe]);

  // 🔹 İlk chat bilgisi ve mesajları fetch etme
  useEffect(() => {
    if (userLoading) return;
    const getChatInfo = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data: chatData } = await supabase
          .from("chats")
          .select("name")
          .eq("id", chatId)
          .single();

        const { data: usersData } = await supabase
          .from("chat_members")
          .select("users(id, name, avatar_url,email, created_at)")
          .eq("chat_id", chatId);

        setMembers(usersData?.map(({ users }) => ({
          id: users.id,
          name: users.name ?? '',
          avatar_url: users.avatar_url ?? '',
          email: users.email ?? '',
          created_at: users.created_at ?? '',
        })) || []);

        const { data: messageData } = await supabase
          .from("messages")
          .select("id, content, chat_id, user_id, created_at, image_url, file_url, location, reply_to, users(id, name, avatar_url)")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        const { data: blockedData } = await supabase
          .from("contacts")
          .select("*")
          .eq("is_blocked", true)
          .eq("owner_id", user.id);

        const { data: blockedByData } = await supabase
          .from("contacts")
          .select("*")
          .eq("is_blocked", true)
          .neq("owner_id", user.id)
          .eq("contact_id", user.id);

        setBlockedByMe(blockedData || []);
        setBlockedMe(blockedByData || []);

        blockedRef.current = { blockedByMe: blockedData || [], blockedMe: blockedByData || [] };

        const filteredMessages = (messageData || []).filter(msg => {
          const { blockedByMe, blockedMe } = blockedRef.current;
          const isBlocked = blockedByMe.some(c => c.contact_id === msg.user_id) ||
                            blockedMe.some(c => c.owner_id === msg.user_id);
          return !isBlocked;
        });

        setMessages(filteredMessages as MessageType[]);

        setChatInfo({
          id: chatId,
          name: chatData?.name || null,
          users: usersData?.map(({ users }) => users) || [],
        });

        const { data: contactsData } = await supabase
          .from("contacts")
          .select("*")
          .eq("is_blocked", false)
          .eq("owner_id", user.id);

        setContacts(contactsData || []);
      } catch (error) {
        console.error("Sohbet verileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    getChatInfo();
  }, [chatId, user, userLoading]);

  // 🔹 Mesajları okundu olarak işaretleme
  useEffect(() => {
    if (!user?.id || !chatId) return;

    supabase
      .from("user_message_status")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("chat_id", chatId)
      .eq("is_read", false)
      .then(({ error }) => {
        if (error) console.error("Mesajlar okunmuş olarak işaretlenemedi:", error.message);
      });
  }, [chatId, user?.id]);

  // 🔹 Realtime channel setup
  useEffect(() => {
    if (!user?.id || !chatId || userLoading) return;

    const setupChannel = async () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

       const newChannel = supabase
        .channel(`messages:${chatId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${chatId}`,
          },
          async (payload) => {
            const newMessage = payload.new as MessageType;
            const { blockedByMe, blockedMe } = blockedRef.current;
            const isBlocked = blockedByMe.some(c => c.contact_id === newMessage.user_id) ||
                              blockedMe.some(c => c.owner_id === newMessage.user_id);

            if (!isBlocked) {
              const { data: userData } = await supabase
                .from("users")
                .select("id, name, avatar_url")
                .eq("id", newMessage.user_id)
                .single();

              const messageWithUser = {
                ...newMessage,
                users: userData || { id: newMessage.user_id, name: "Unknown", avatar_url: null }
              };

              setMessages(prev => {
                if (prev.some(msg => msg.id === messageWithUser.id)) return prev;
                return [...prev, messageWithUser];
              });

              if (newMessage.user_id !== user.id) {
                playMessageSound();
                toast.info(`Yeni mesaj: ${newMessage.content || "Yeni mesaj var!"}`);
              }
            }
          }
        )
        .subscribe(status => console.log("Realtime channel status:", status));

      channelRef.current = newChannel;
    };

    setupChannel();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId, user?.id, userLoading]);
   const isDirectChat = members.length === 2;
 const isBlockedBetween = (memberId: string) => {
    return blockedByMe.some(c => c.contact_id === memberId) || blockedMe.some(c => c.owner_id === memberId);
  };

  //mesaj gönderme
  const sendMessage = async () => {
     if (!newMessage.trim() || !user) return;

    if (isDirectChat && members.some(m => isBlockedBetween(m.id))) {
      toast.error("Bu kullanıcıyla mesajlaşamazsınız!");
      return;
    }


    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        user_id: user?.id,
        content: newMessage.trim(),
        reply_to: replyingTo?.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Mesaj gönderilemedi:", error.message);
    }
  
    // 2. Tüm üyeler için okunmamış status kaydı oluştur
  const { error: statusError } = await supabase
    .from('user_message_status')
    .insert(
      members
        .filter(member => member.id !== user.id)
        .map(member => ({
          user_id: member.id,
          message_id: data?.id,
          chat_id: chatId,
          is_read: false
        }))
    );

  if (statusError) throw statusError;

    // yeni mesajı ekle
    // if (data) {
    //   setMessages((prev) => [...prev, data]);
    // }
    setNewMessage("");
    playMessageSound();

    //chats tablosunda last_message_id alanını güncelle
    const { error: updateError } = await supabase
      .from("chats")
      .update({ last_message_id: data?.id })
      .eq("id", chatId);

    if (updateError) {
      console.error("last_message_id güncellenemedi:", updateError.message);
    }
     
await notifyUsers({
  chatId,
  members,
  blockedByMe,
  blockedMe,
  senderId: user.id,
  message: newMessage.trim(),
});


  };
  //resim
  const handleImageUpload = async (file: File) => {
    if (!user) return;
       if (isDirectChat && members.some(m => isBlockedBetween(m.id))) {
      toast.error("Bu kullanıcıyla mesajlaşamazsınız!");
      return;
    }

    try {
      // 1. Resmi Supabase'e yükle
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;

      // 2. Mesaj olarak gönder
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          user_id: user?.id,
          image_url: uploadData.path,
          content: "Bir resim gönderdi",
        })
        .select()
        .single();

      if (messageError) throw messageError;

      setMessages((prev) => [...prev, messageData]);
      playMessageSound();
      await notifyUsers({
          chatId,
          members,
          blockedByMe,
          blockedMe,
          senderId: user?.id,
          message: newMessage.trim(),
        });
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resim yüklenirken hata oluştu");
    }
  };
  //dosya yükleme
  const handleFileUpload = async (file: File) => {
    if (!user) return;
       if (isDirectChat && members.some(m => isBlockedBetween(m.id))) {
      toast.error("Bu kullanıcıyla mesajlaşamazsınız!");
      return;
    }
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("chat-files")
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          user_id: user?.id,
          content: file.name,
          file_url: uploadData.path,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      setMessages((prev) => [...prev, messageData]);
      await notifyUsers({
        chatId,
        members,
        blockedByMe,
        blockedMe,
        senderId: user?.id,
        message: newMessage.trim(),
      });
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      toast.error("Dosya yüklenirken hata oluştu");
    }
  };
  //konum gönderme
  const handleSendLocation = async(location: { lat: number; lng: number }) => {
    if (!user || !chatId) return;
       if (isDirectChat && members.some(m => isBlockedBetween(m.id))) {
      toast.error("Bu kullanıcıyla mesajlaşamazsınız!");
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        user_id: user?.id,
        content: "Bir konum gönderdi",
        location: location,
      })
      .select()
      .single();

    if (error) {
      console.error("Konum gönderilemedi:", error.message);
    }
    if (data) {
      setMessages((prev) => [...prev, data]);
    }
    playMessageSound();
    await notifyUsers({
        chatId,
        members,
        blockedByMe,
        blockedMe,
        senderId: user?.id,
        message: newMessage.trim(),
      });
  };

  //Ayarları göster
  const handleSettings = () => {
    setOpenSettings(!openSettings);
  };
  //Gruptan çık
  const handleLeaveGroup = async () => {
    if (!user || !chatId) return;

    const success = await leaveChat({ chatId, userId: user.id });
    if (success) {
      toast.success("Gruptan başarıyla çıkıldı.!");
      router.push("/");
    } else {
      alert("Gruptan çıkılamadı, lütfen tekrar deneyin.");
    }
  };
  const sendVoiceMessage=async(audioURL:string)=>{
    const {data,error}=await supabase.from("messages").insert({
      chat_id: chatId,
      user_id: user?.id,
      content: "Bir sesli mesaj gönderdi",
      file_url: audioURL,
    }).select().single();

    if (error) {
      console.error("Sesli mesaj gönderilemedi:", error.message);
      toast.error("Sesli mesaj gönderilemedi.");
    } else {
    setMessages((prev) => (data ? [...prev, data] : prev));
    playMessageSound();
       await notifyUsers({
        chatId,
        members,
        blockedByMe,
        blockedMe,
        senderId: user!.id,
        message: "Bir sesli mesaj gönderdi",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col dark:bg-gray-800 items-center justify-center h-screen">
        <div className="animate-spin dark:bg-gray-600  dark:text-gray-100 rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-3 text-gray-600 dark:text-gray-100">Sohbetler yükleniyor...</p>
      </div>
    );
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenSettings(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-blue-100 dark:bg-blue-800  ">
    
      {/* Bilgi Modalı */}
      <InformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        chatName={chatInfo?.name || null}
        members={members}
      />
      {/* Header */}
      <ChatHeader
        chatInfo={chatInfo}
        members={members}
        contacts={contacts}
        openSettings={openSettings}
        setOpenSettings ={setOpenSettings}
        handleSettings={handleSettings}
        handleOverlayClick={handleOverlayClick}
        handleLeaveGroup={handleLeaveGroup}
        setShowInfoModal={setShowInfoModal}
      />

      {/* Mesaj listesi*/}
      <MessagesList
        messages={messages}
        userId={user?.id}
        chatUsers={chatInfo?.users || []}
        setReplyingTo={setReplyingTo}
      />

      {/* Input Area */}
      <MessageInput
        onSendLocation={handleSendLocation}
        newMessage={newMessage}
        onSendImage={handleImageUpload}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        onSendFile={handleFileUpload}
        onSendVoiceMessage={sendVoiceMessage}
        setReplyingTo={setReplyingTo}
        replyingTo={replyingTo}
      />
    </div>
  );
};

export default Page;
