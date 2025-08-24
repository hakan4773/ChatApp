"use client";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { leaveChat } from "../../../utils/leaveChat";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InformationModal from "../../../components/InformationModal";
import { playMessageSound } from "@/app/utils/sound";
import MessageInput from "@/app/components/MessageInput";
import ChatHeader from "@/app/components/ChatHeader";
import MessagesList from "@/app/components/MessagesList";
import { FriendsProps } from "@/types/contactUser";
 import { notifyUsers } from "@/app/utils/NotifyUsers";
import { ChatInfoType, MembersType, MessageType, MessageWithUserType } from "@/types/message";
type SubscriptionStatus = 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'ERROR';

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

  useEffect(() => {
    if (userLoading) return;
    const getChatInfo = async () => {
       setLoading(true);
        if (!user) {
          setLoading(false);
          return;
            }

      try {
        // 1. Sohbet bilgilerini al
        const { data: chatData } = await supabase
          .from("chats")
          .select("name")
          .eq("id", chatId)
          .single();

        // 2. Sohbetteki kullanıcıları al (mevcut kullanıcı hariç)
        const { data: usersData } = await supabase
          .from("chat_members")
          .select("users(id, name, avatar_url,email, created_at)")
          .eq("chat_id", chatId);

        if (usersData) {
          setMembers(usersData.map(({ users }) => ({
            id: users.id,
            name: users.name ?? '',
            avatar_url: users.avatar_url ?? '',
            email: users.email ?? '',
            created_at: users.created_at ?? '',
          })));
        } else {
          setMembers([]);
        }
        //mesajları getirme
        const { data:messageData, error } = await supabase
          .from("messages")
          .select(
            "id, content,  user_id, created_at, image_url, file_url, location, users(id, name, avatar_url)"
          )
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Mesajlar alınamadı:", error.message);
          return;
        }
        //engellenen kullanıcıları getir 
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

        // Engellenen mesajları filtrele
        const filteredMessages = messageData?.filter(msg => {
          const blockedSender = blockedData?.find(c => c.contact_id === msg.user_id);
          return !blockedSender?.is_blocked;
        }) || [];
        setMessages(filteredMessages);

        // Engellenmemiş kontaklar
        const { data: contactsData } = await supabase
          .from("contacts")
          .select("*")
          .eq("is_blocked", false)
          .eq("owner_id", user.id);

        setContacts(contactsData || []);
       

        setChatInfo({
          id: chatId,
          name: chatData?.name || null,
          users: usersData?.map(({ users }) => users) || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Sohbet verileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    getChatInfo();
  }, [chatId, user, userLoading]);

    //Mesajı okundu olarak işaretleme
useEffect(() => {
  if (!user?.id || !chatId) return;

  const markMessagesAsRead = async () => {
    const { error } = await supabase
      .from("user_message_status")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("chat_id", chatId)
      .eq("is_read", false); 

    if (error) {
      console.error("Mesajlar okunmuş olarak işaretlenemedi:", error.message);
    }

    
  };

  markMessagesAsRead();
}, [chatId, user?.id]);

useEffect(() => {
  if (!chatId || !user?.id) return;
  const channel = supabase
    .channel(`messages:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        const newMessage = payload.new as MessageType;
        setMessages((prev) => [...prev, newMessage]);
        if (newMessage.user_id !== user.id) playMessageSound();
      }
    );

  channel.subscribe();
  return () => {
    channel.unsubscribe();
  };
}, [chatId, user?.id]);




useEffect(() => {
  if (!user?.id) return;

const subscription = supabase
    .channel('public:user_message_status')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'user_message_status', filter: `user_id=eq.${user.id}` },
      async (payload) => {
      if (payload.new.user_id !== user.id) {
        const { data: messageData } = await supabase
          .from('messages')
          .select('content')
          .eq('id', payload.new.message_id)
          .single();

        toast.info(`Yeni mesaj: ${messageData?.content || 'Yeni mesaj var!'}`);
        playMessageSound();
      }
    })
    .subscribe();

return () => {
  subscription.unsubscribe();
};
}, [user?.id]);
  
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

    //yeni mesajı ekle
    if (data) {
      setMessages((prev) => [...prev, data]);
    }
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
      />
    </div>
  );
};

export default Page;
