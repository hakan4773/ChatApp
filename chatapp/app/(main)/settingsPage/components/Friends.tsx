import { useUser } from '@/app/context/UserContext';
import { supabase } from '@/app/lib/supabaseClient'
import { ChatBubbleBottomCenterIcon, NoSymbolIcon, TrashIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
 import {FriendsProps} from "../../../../types/contactUser";

interface OpenProps{
    setOpenFriendsState: (open: boolean) => void;
    friends:FriendsProps[];
    setFriends: React.Dispatch<React.SetStateAction<FriendsProps[]>>;
    handleBlock:(id:string)=>void
}
export default function Friends({setOpenFriendsState,friends,setFriends,handleBlock}:OpenProps) {
    const {user}=useUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    useEffect(() => {
      const getFriendList = async () => {
        const { data, error } = await supabase
          .from("contacts")
          .select(`contact_id,
              nickname,
              email,
              users!contacts_contact_id_fkey1 (
                id,
                name,
                email,
                avatar_url
           )`).eq("is_blocked", false)
          .eq("owner_id", user?.id);

        if (error) {
          console.error("Kullanıcılar getirilemedi.");
        } else {
          setFriends(data as FriendsProps[]);
        }
      };
      getFriendList();
    },[user]);

    const filteredFriends = friends.filter(friend =>
  friend.nickname ? friend.nickname.toLowerCase().includes(searchTerm.toLowerCase()) : false
);

console.log(friends)

const handleDelete = async (id: string) => {
  const { error } = await supabase.from("contacts").delete().eq("contact_id", id).eq("owner_id", user?.id);;
if(error) {
  toast.error("Kullanıcı silinirken hata oluştu")
}
else {
  setFriends(friends.filter(friend => friend.contact_id !== id));
  toast.success("Kullanıcı başarıyla silindi");
}
setConfirmDelete(null);
};

  return (
<div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 w-full max-w-md mx-auto transform translate-y-[-10%] md:translate-y-0">
              <h3 className="text-lg font-semibold dark:text-white">Arkadaşlar</h3>
              <div className="border border-gray-100 mb-2" ></div>
       <button
          onClick={() => setOpenFriendsState(false)}
          className="absolute top-3 right-3 text-gray-400  hover:text-red-500 transition-colors"
          aria-label="Modal'ı Kapat"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <input
          type="text"
          placeholder="Arkadaş ara..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <ul className="flex flex-col space-y-2  overflow-y-auto max-h-[300px] md:max-h-[400px]">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <li key={friend.contact_id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition  flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                    <Image
                      src={friend.users.avatar_url ? friend.users.avatar_url : `/5.jpg`}
                      alt={friend?.nickname +"images"}
                      width={40}
                      height={40}
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/5.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium dark:text-gray-200">{friend.nickname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2  ">
                  <button onClick={()=>handleBlock(friend.contact_id)} className='rounded-md bg-yellow-500  hover:bg-yellow-600 text-white px-2 py-2 '>
                    <NoSymbolIcon className="h-4 w-4 text-white" /></button>
                  <button onClick={()=>setConfirmDelete(friend.contact_id)} className='rounded-md bg-red-500 hover:bg-red-600 text-white px-2 py-2 '>
                    <TrashIcon className="h-4 w-4  text-white" /></button>
                </div>
              </li>
            ))
          ) : (
           <div className="text-center py-4 dark:text-white flex flex-col items-center">
              <UserIcon className="h-8 w-8 mb-2 text-gray-400" /> 
              Henüz arkadaşınız yok. Ekleyin!
            </div>
          )}
        </ul>
        {confirmDelete && (
          <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="mb-4 dark:text-white">Bu arkadaşı silmek istiyor musunuz?</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setConfirmDelete(null)} className="text-gray-500">İptal</button>
                <button onClick={() => handleDelete(confirmDelete)} className="text-red-500  hover:bg-white hover:text-red-500 p-2 rounded">Sil</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
