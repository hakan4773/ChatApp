"use client"
import { useUser } from '@/app/context/UserContext'
import { supabase } from '@/app/lib/supabaseClient'
import { TrashIcon, BellSlashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useParams,usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { leaveChat } from "../../../utils/leaveChat";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import { format } from "timeago.js";
import InformationModal from '../../../components/InformationModal'
import { playMessageSound } from '@/app/utils/sound'
import { useScrollToBottom } from '@/app/hooks/useScrollToBottom'
import MessageInput from '@/app/components/MessageInput'

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
    .select("id, content, user_id, created_at, users(id, name, avatar_url)")
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
  } else if (data) {
    //yeni mesajı ekle
    setMessages(prev => [...prev, data]); 
    setNewMessage("");
    playMessageSound();
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
      {/* Header */}
      <InformationModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        chatName={chatInfo?.name || null}
        members={members}
      />
      
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between shadow-md relative "
       onClick={handleOverlayClick} >
        <div className="flex items-center space-x-3">
          <Image
            src={chatInfo?.users[0]?.avatar_url || "/5.jpg"}
            width={40}
            height={40}
            alt="avatar"
            className="rounded-full object-cover border-2 border-white"
          />
          <div>
            <h1 className="font-bold">{chatInfo?.name}</h1>
            <div className="flex">
              {members.map((member, index) => (
                <p key={index} className="text-xs text-blue-100">
                  {member.name},
                </p>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleSettings}
          className="p-2 rounded-full hover:bg-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        {/* ayarlar bölümü */}
        {openSettings && (
          <div className="absolute flex flex-col  border p-2 space-y-3 z-50  top-9 bg-gray-50 border-gray-50 text-gray-500 right-8 rounded-md ">
            <button className="hover:bg-gray-100 flex space-x-2 items-center"  onClick={()=>setShowInfoModal(true)}>
              <InformationCircleIcon
                className="h-4 w-4 text-gray-500 "
              />
              <span>Bilgi</span>
            </button>
            <button className="hover:bg-gray-100 flex space-x-2 items-center">
              <BellSlashIcon className="h-4 w-4 text-gray-500" />{" "}
              <span>Sessize Al</span>
            </button>
            <button
              onClick={handleLeaveGroup}
              className="hover:bg-gray-100 flex space-x-2 items-center"
            >
              <TrashIcon className="h-4 w-4 text-gray-500" />
              <span>Gruptan Çık</span>
            </button>
          </div>
        )}
      </div>

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
                src={msg.avatar_url || "/5.jpg"}
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
              <p>{msg.content}</p>
              <p className="text-xs text-gray-600 mt-1">
                {format(msg.created_at)}
              </p>
            </div>
          </div>
        ))}


      </div>
      {/* Input Area */}
    <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage}/>
    </div>
  );
}

export default Page