"use client"
import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../context/UserContext';
import { UserProps,AddNewUsersProps} from "../../types/contactUser";


function AddNewUsers({ setOpenUsers, onUserAdded }: AddNewUsersProps) {
    const { user } = useUser();
    const [newUser, setNewUser] = useState({ name: '', email: ''});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
  const { name, email } = newUser;
  const userId = user?.id; 

  if (!name || !email) {
    toast.error("Lütfen tüm alanları doldurun.");
    return;
  }

  const { data: existingUser, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (userError || !existingUser) {
    toast.error("Kullanıcı sistemde bulunamadı.");
    return;
  }
    if (existingUser.id === userId) {
      toast.error("Kendinizi ekleyemezsiniz.");
      return;
    }
  const { data: existingContact } = await supabase
    .from("contacts")
    .select("*")
    .eq("owner_id", userId)
    .eq("contact_id", existingUser.id)
    .single();

  if (existingContact) {
    toast.error("Bu kullanıcı zaten eklenmiş.");
    return;
  }

  const { data, error } = await supabase.from("contacts").insert({
    owner_id: userId,
    contact_id: existingUser.id,
    email: email,
    nickname: name 
  }).select() 
  .maybeSingle();

  if (error) {
    toast.error("Kullanıcı eklenirken hata oluştu.");
  } else {
    toast.success("Yeni Kullanıcı Eklendi");
     onUserAdded(data as UserProps);
    setNewUser({ name: '', email: ''});

    const {error:notifError}=await supabase.from("notifications").insert({
      user_id: existingUser.id,
      type:"new_contact",
      title: `${user?.user_metadata.name || 'Bilinmeyen'} kişisinden Yeni Bildirim`,
      message: `${user?.user_metadata.name}  sizi ekledi.`,
      sender_id: userId,
      is_read: false
    });

    if (notifError) {
      console.error("Bildirim gönderilirken hata oluştu", notifError);
    } 

  }
  
}
  

  return (
      <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 shadow-2xl">

      <div className="bg-white relative dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 w-full max-w-md">
                <button
           onClick={() => setOpenUsers(false)}
          className="absolute top-1 right-1 text-gray-400  hover:text-red-500 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button> 
        
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Yeni Kullanıcı Ekle
        </h3> 
          <div className="border-b border-gray-200 mb-4"></div>
        <input
        type="text"
        name="name"
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        placeholder="İsim"
        value={newUser.name}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        placeholder="Email"
        value={newUser.email}
        onChange={handleInputChange}
      />
      <button className='bg-indigo-600 text-white rounded-md p-2 hover:bg-indigo-700 transition-colors' onClick={handleAddUser}>Kullanıcı Ekle</button>
    </div>
    </div>
  )
}

export default AddNewUsers
