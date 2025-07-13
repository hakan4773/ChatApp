"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemaContext";

function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("tr");


  return (
    <div className="min-h-screen  p-4 transition-colors duration-300" data-theme={theme}>
      <div className="max-w-2xl mx-auto">
        {/* Geri Butonu */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          Geri
        </button>

        {/* Başlık */}
         <h1 className="text-2xl font-bold  mb-6">Ayarlar</h1>
         {/* Hesap Ayarları */}
        <div className=" p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <UserIcon className="w-5 h-5 mr-2 " />
            <h2 className="text-lg font-semibold ">Hesap Ayarları</h2>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/settings/friends')}
              className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Arkadaş Listesi</span>
              <span className="text-gray-500">Yönet</span>
            </button>
            
            <button 
              onClick={() => router.push('/settings/blocked')}
              className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Engellenen Kullanıcılar</span>
              <span className="text-gray-500">Yönet</span>
            </button>
          </div>
        </div>
        
        {/* Tema Ayarları */}
        <div className=" p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold  mb-4">Tema Ayarları</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Tema Seçimi</label>
                <select
                 value={theme}
                onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Açık Tema</option>
                <option value="dark">Koyu Tema</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dil Ayarları */}
        <div className=" p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold  mb-4">Dil Ayarları</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm ">Dil Seçimi</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

       

      </div>
    </div>
  );
}

export default SettingsPage;