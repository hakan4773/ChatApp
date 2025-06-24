"use client"
import { useUser } from '@/app/context/UserContext'
import { supabase } from '@/app/lib/supabaseClient'
import { ArrowLeftIcon, BellSlashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useParams,usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { leaveChat } from "../../../utils/leaveChat";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'

const Page = () => {
  const router = useRouter();
  const { user } = useUser();
  const params = useParams();
  const chatId = params?.id as string;
  const [newMessage, setNewMessage] = useState(''); 
const [messages, setMessages] = useState<
  {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
  }[]
>([]);  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<{
    name: string | null;
    users: Array<{
      id: string;
      name: string | null;
      avatar_url: string | null;
    }>;
  } | null>(null);
  const [openSettings,setOpenSettings]=useState(false);
  useEffect(()=>{
const getChatInfo=async()=>{
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
          .select('users(id, name, avatar_url)')
          .eq('chat_id', chatId)
          .neq('user_id', user.id);
//mesajları getirme
       const { data, error } = await supabase
       .from("messages")
       .select("*")
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
       } catch (error) {
        console.error('Sohbet verileri alınamadı:', error);
      } finally {
        setLoading(false);
      }

}

getChatInfo();

  },[chatId])

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
      toast.success('Mesaj başarıyla gönderildi!');
    router.push("/"); 
  } else {
    alert("Gruptan çıkılamadı, lütfen tekrar deneyin.");
  }
};

  return (
    <div className='min-h-screen flex flex-col bg-blue-100'>
      {/* Header */}
      <div className='bg-blue-500 text-white p-4 flex items-center justify-between shadow-md relative'>
        <div className='flex items-center space-x-3'>
          <Image 
            src={chatInfo?.users[0]?.avatar_url || "/5.jpg"}
            width={40} 
            height={40} 
            alt="avatar" 
            className='rounded-full object-cover border-2 border-white'
          />
          <div>
            <h1 className='font-bold'>{chatInfo?.name}</h1>
            <p className='text-xs text-blue-100'>Online</p>
          </div>
        </div>
        <button onClick={handleSettings} className='p-2 rounded-full hover:bg-blue-600'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        {
          openSettings && (
            <div className='absolute flex flex-col  border p-2 space-y-3 z-50  top-9 bg-gray-50 border-gray-50 text-gray-500 right-8 rounded-md '>
<button className='hover:bg-gray-100 flex space-x-2 items-center' >
  <InformationCircleIcon className="h-4 w-4 text-gray-500 " />  <span>Bilgi</span> 
</button>
  <button className='hover:bg-gray-100 flex space-x-2 items-center'>
   <BellSlashIcon className="h-4 w-4 text-gray-500"/> <span>Sessize Al</span> 
  </button>
  <button onClick={handleLeaveGroup} className='hover:bg-gray-100 flex space-x-2 items-center'>
   <ArrowLeftIcon className="h-4 w-4 text-gray-500" />
 <span>Gruptan Çık</span>
  </button>
              </div>
          )
        }
      </div>

      {/* Messages Area */}
     <div className='flex-1 p-4 overflow-y-auto space-y-4'>
  {messages.map((msg, index) => (
    <div key={msg.id || index} className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'items-start space-x-2'}`}>
      {msg.user_id !== user?.id && (
        <Image 
          src={"/5.jpg"} 
          width={32} 
          height={32} 
          alt="avatar" 
          className='rounded-full object-cover'
        />
      )}
      <div className={`${msg.user_id === user?.id ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'} p-3 rounded-lg max-w-xs shadow`}>
        <p>{msg.content}</p>
        <p className='text-xs text-gray-400 mt-1'>{new Date(msg.created_at).toLocaleTimeString()}</p>
      </div>
    </div>
  ))}
</div>

      {/* Input Area */}
      <div className='p-4 border-t bg-white'>
        <div className='flex items-center space-x-2'>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <input 
             type="text" 
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
             placeholder='Type a message...' 
             className='flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button onClick={sendMessage} className='p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page