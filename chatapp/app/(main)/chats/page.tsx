"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import { MagnifyingGlassIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";


function Page() {

 return (
    <div className="bg-gray-100    overflow-hidden ">
      {/* Arama Çubuğu */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Sohbet Ara..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Sohbet Listesi */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <div className="space-y-3">
          {/* Sohbet Öğesi 1 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ahmet Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Merhaba!
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">2 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                3
              </span>
            </div>
          </div>

          {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Yakup Bulduk</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>

          {/* Daha fazla sohbet öğesi eklenebilir */}
        </div>
      </div>
    </div>
  );
}
export default Page;