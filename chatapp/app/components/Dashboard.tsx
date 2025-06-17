"use client";
import { useUser } from "@/app/context/UserContext";
import { ArrowLeftOnRectangleIcon, BellIcon, ChatBubbleLeftIcon, DocumentArrowUpIcon, QuestionMarkCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Users from "../components/Users"

 function dashboard() {
 const {user}=useUser();
const [openUsers,setOpenUsers]=useState<boolean>(false)
const handleOpen=()=>{
  setOpenUsers(!openUsers)
}
  return (
   
    <div className="min-h-screen bg-gray-100 flex relative">

      <div className="flex-1 flex flex-col">
    

        {/* Dashboard İçeriği */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            {/* Hoş Geldin Mesajı */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-gray-800">Merhaba, {user?.user_metadata.name}!</h2>
              <p className="text-gray-500 mt-2">
                ChatApp'e hoş geldiniz! Yeni bir sohbete başlayın veya dosyalarınızı paylaşın.
              </p>
            </div>

            {/* Hızlı Erişim Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Kart 1: Yeni Sohbet */}
              <button
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-indigo-50"
                onClick={handleOpen}
              >
                
                <ChatBubbleLeftIcon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">Yeni Sohbet</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Arkadaşlarınızla anında sohbete başlayın.
                </p>
              </button>
{
  openUsers && 
<Users setOpenUsers={setOpenUsers} />
  
}
              {/* Kart 2: Dosya Paylaşımı */}
              <Link
                href="/files"
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-indigo-50"
              >
                <DocumentArrowUpIcon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">Dosya Paylaş</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Belgelerinizi güvenli bir şekilde paylaşın.
                </p>
              </Link>

              {/* Kart 3: Profili Görüntüle */}
              <Link
                href="/profiles"
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-indigo-50"
              >
                <UserCircleIcon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-800">Profil</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Profil bilgilerinizi düzenleyin.
                </p>
              </Link>
            </div>

            {/* Özet Alanı */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hızlı Özet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">5</p>
                  <p className="text-sm text-gray-500">Aktif Sohbet</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">12</p>
                  <p className="text-sm text-gray-500">Paylaşılan Dosya</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">3</p>
                  <p className="text-sm text-gray-500">Yeni Bildirim</p>
                </div>
              </div>
            </div>  
            
            </div>
            </div>
            </div>
            </div>);
}

export default dashboard;
