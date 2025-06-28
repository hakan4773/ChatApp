"use client"
import { useUser } from '@/app/context/UserContext'
import { supabase } from '@/app/lib/supabaseClient'
import { TrashIcon, BellSlashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { leaveChat } from "../../../utils/leaveChat";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import { format } from "timeago.js";
import InformationModal from '../../../components/InformationModal'
import { playMessageSound } from '@/app/utils/sound'
import { useScrollToBottom } from '@/app/hooks/useScrollToBottom'
import MessageInput from '@/app/components/MessageInput'
import ChatHeader from '@/app/components/ChatHeader'

const Page = () => {
  const router = useRouter();
  const { user } = useUser();
  const params = useParams();
  const chatId = params?.id as string;
  const [newMessage, setNewMessage] = useState(''); 
  const [members,setMembers]=useState<
  {
    id: string;
    name: string;
    avatar_url: string;
    created_at: string;
  }[]
>([]);
const [messages, setMessages] = useState<
  {
    id: string;
    content: string;
    user_id: string;
    avatar_url:string;
    file_url:string | null;
    image_url:string;
    created_at: string;
  }[]
>([]); 
 const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<{
    name: string | null;
    users: Array<{
      id: string;
      name: string | null;
      avatar_url: string | null;
    }>;
  } | null>(null);
  const [openSettings,setOpenSettings]=useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false); 
  const messagesContainerRef = useScrollToBottom(messages);

  useEffect(()=>{
const getChatInfo=async()=>{
  setLoading(true)
  if (!user) return;

    try {
        // 1. Sohbet bilgilerini al
        const { data: chatData } = await supabase
          .from('chats')
          .select('name')
          .eq('id', chatId)
          .single();

        // 2. Sohbetteki kullanıcıları al (mevcut kullanıcı hariç)
        const { data: usersData } = await supabase
          .from('chat_members')
          .select('users(id, name, avatar_url, created_at)') 
          .eq('chat_id', chatId);

          if (usersData) {
         setMembers(usersData.map(({ users }) => users) || []);
          } else {
       setMembers([]);
          }
//mesajları getirme
      const { data, error } = await supabase
  .from("messages")
    .select("id, content, user_id, created_at,image_url,file_url, users(id, name, avatar_url)")
  .eq("chat_id", chatId)
  .order("created_at", { ascending: true });

    if (error) {
      console.error("Mesajlar alınamadı:", error.message);
      return;
    }

    setMessages(data || []);

          
        setChatInfo({
          name: chatData?.name || null,
          users: usersData?.map(({ users }) => users) || []
        });
        setLoading(false);
       } catch (error) {
        console.error('Sohbet verileri alınamadı:', error);
      } finally {
        setLoading(false);
      }

}

getChatInfo();

  },[chatId]);
 

//mesaj gönderme
  const sendMessage = async () => {
  if (!newMessage.trim() || !user) return;
 //mesajı kaydet
  const { data, error } = await supabase.from("messages").insert({
    chat_id: chatId,
    user_id: user?.id,
    content: newMessage.trim(),
  }).select().single();

  if (error) {
    console.error("Mesaj gönderilemedi:", error.message);
  } 
    //yeni mesajı ekle
    setMessages(prev => [...prev, data]); 
    setNewMessage("");
    playMessageSound();
  
  //chats tablosunda last_message_id alanını güncelle
  const { error: updateError } = await supabase
    .from("chats")
    .update({ last_message_id: data.id })
    .eq("id", chatId);

 if (updateError) {
    console.error("last_message_id güncellenemedi:", updateError.message);
  }
};
//resim 
const handleImageUpload = async (file: File) => {
    try {
      // 1. Resmi Supabase'e yükle
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;

      // 2. Mesaj olarak gönder
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          user_id: user?.id,
          image_url: uploadData.path,
          content: "Bir resim gönderdi"
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // 3. Mesaj listesini güncelle
      setMessages(prev => [...prev, messageData]);
      
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resim yüklenirken hata oluştu");
    }
  };
 const handleFileUpload = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(`public/${fileName}`, file);

    if (uploadError) throw uploadError;

    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: user?.id,
        content: file.name, 
        file_url: uploadData.path, 
      })
      .select()
      .single();

    if (messageError) throw messageError;

    setMessages(prev => [...prev, messageData]);
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    toast.error("Dosya yüklenirken hata oluştu");
  }
};



//Ayarları göster
const handleSettings=()=>{
  setOpenSettings(!openSettings);
}
//Gruptan çık
const handleLeaveGroup = async () => {
  if (!user || !chatId) return;

  const success = await leaveChat({ chatId, userId: user.id });
  if (success) {
      toast.success('Gruptan başarıyla çıkıldı.!');
    router.push("/"); 
  } else {
    alert("Gruptan çıkılamadı, lütfen tekrar deneyin.");
  }
};
//yüklenme durumu
 if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-3 text-gray-600">Sohbetler yükleniyor...</p>
      </div>
    );
  }
  // Dışa tıklama ile kapanma için handler
   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        setOpenSettings(false);
      }
    };

  return (
    <div className=" h-screen flex flex-col bg-blue-100 ">
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
  openSettings={openSettings}
  handleSettings={handleSettings}
  handleOverlayClick={handleOverlayClick}
  handleLeaveGroup={handleLeaveGroup}
  setShowInfoModal={setShowInfoModal}
/>


      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${
              msg.user_id === user?.id ? "justify-end" : "items-start space-x-2"
            }`}
          >
            {msg.user_id !== user?.id && (
              <Image
                src={chatInfo?.users.find((user) => user.id === msg.user_id)?.avatar_url || "/5.jpg"}
                width={32}
                height={32}
                alt="avatar"
                className="rounded-full h-8 w-8 object-cover mr-2"
              />
            )}
            <div
              className={`${
                msg.user_id === user?.id
                  ? "bg-blue-500 my-1 text-white rounded-tr-none"
                  : "bg-white text-gray-900 rounded-tl-none"
              } p-3 rounded-lg max-w-xs shadow`}
            >
            {msg.image_url ? (
  <img
    src={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-images/${msg.image_url}`}
    alt="Resim"
    className="rounded-md max-h-60 max-w-60 object-contain"
  />
) : msg.file_url ? (
  <a
    href={`https://kpdoboupcsggbkjhfacv.supabase.co/storage/v1/object/public/chat-files/${msg.file_url}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
  >
    {msg.content}
  </a>
) : (
  <p>{msg.content}</p>
)}
              <p className="text-xs text-gray-600 mt-1">
                {format(msg.created_at)}
              </p>
            </div>
          </div>
        ))}


      </div>
      {/* Input Area */}
    <MessageInput newMessage={newMessage}  onSendImage={handleImageUpload}
 setNewMessage={setNewMessage} sendMessage={sendMessage} onSendFile={handleFileUpload}  />
    </div>
  );
}

export default Page