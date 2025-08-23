"use client";
import { useUser } from '@/app/context/UserContext';
import { supabase } from '@/app/lib/supabaseClient';
import { FriendsProps } from '@/types/contactUser';
import { NoSymbolIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { useEffect } from 'react'

type OpenProps = {
    setOpenBlockedState:(open: boolean) => void;
    blocked:FriendsProps[];
    setBlocked: React.Dispatch<React.SetStateAction<FriendsProps[]>>
    handleBlock:(id:string)=>void
 }
   
function Blocked({setOpenBlockedState,blocked,setBlocked,handleBlock}:OpenProps) {
    const { user } = useUser();
     useEffect(()=>{
      if(!user?.id){
        return;
      }
      const getBlockedList = async () => {
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
           )`)
          .eq("is_blocked", true)
          .eq("owner_id", user?.id);
  
        if (error) {
          console.error("Kullanıcılar getirilemedi.");
        } else {
          setBlocked(data as FriendsProps[]);
        }
      };
      getBlockedList();

    },[user?.id, setBlocked]);

    return (
   <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 w-full max-w-md mx-auto transform translate-y-[-10%] md:translate-y-0">
              <h3 className="text-lg font-semibold dark:text-white">Engellenen Kulllanıcılar</h3>
              <div className="border border-gray-100 mb-2" ></div>
       <button
          onClick={() => setOpenBlockedState(false)}
          className="absolute top-3 right-3 text-gray-400  hover:text-red-500 transition-colors"
          aria-label="Modal'ı Kapat"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
 {/* resim gelmiyor  */}
        <ul className="flex flex-col space-y-2  overflow-y-auto max-h-[300px] md:max-h-[400px]">
          {blocked.length > 0 ? (
            blocked.map((block) => (
              <li key={block.contact_id + "-" + (block.users?.id || "")} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition  flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                    <Image
                      src={block.users?.avatar_url ? block.users.avatar_url : "/5.jpg"}
                      alt={block?.nickname +"images"}
                      width={40}
                      height={40}
                      className="object-cover"
                      // onError={(e) => {
                      //   e.currentTarget.src = "/5.jpg"; 
                      // }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium dark:text-gray-200">{block.nickname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{block.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2  ">
                  <button onClick={()=>handleBlock(block.contact_id)}  className='rounded-md bg-green-500  hover:bg-green-600 text-white px-2 py-2 '>
                    <NoSymbolIcon className="h-4 w-4 text-white" /></button>
                 
                </div>
              </li>
            ))
          ) : (
           <div className="text-center py-4 dark:text-white flex flex-col items-center">
              <UserIcon className="h-8 w-8 mb-2 text-gray-400" /> 
            Engellenen kullanıcı yok !
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Blocked
