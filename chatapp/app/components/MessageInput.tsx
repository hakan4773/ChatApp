"use client"
import { CameraIcon, DocumentIcon, MapPinIcon, MicrophoneIcon, PaperAirplaneIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, sendMessage }) => {
    const [openMethods,setOpenMethods]=useState(false);
    const handleOpenMethods=()=>{
        setOpenMethods(!openMethods);
    }
  return (
     <div className="p-4 border-t bg-white relative">
  <div className="flex items-center space-x-2 relative">
    {/* Mikrofon butonu */}
    <button 
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Sesli mesaj"
    >
      <MicrophoneIcon className="w-5 h-5 text-gray-600" />
    </button>

    {/* Ekstra seçenekler butonu */}
    <button 
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      onClick={handleOpenMethods}
      aria-label="Daha fazla seçenek"
    >
      <PlusCircleIcon className="w-5 h-5 text-gray-600" />
    </button>

    {/* Mesaj input alanı */}
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Bir mesaj yazın..."
      className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />

    {/* Gönder butonu */}
    <button
      onClick={sendMessage}
      disabled={!newMessage.trim()}
      className={`p-2 rounded-full transition-colors ${
        newMessage.trim() 
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
      aria-label="Mesaj gönder"
    >
      <PaperAirplaneIcon className="w-5 h-5" />
    </button>
  </div>

  {/* Açılır menü */}
  {openMethods && (
    <div className="absolute bottom-16 left-12 bg-white shadow-xl rounded-lg p-2 z-20 w-56 border border-gray-100">
      {/* Ok işareti */}
      <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-200"></div>
      
      <div className="flex flex-col space-y-1">
        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors text-left"
          onClick={() => {/* Fotoğraf ekleme fonksiyonu */}}
        >
          <div className="p-2 bg-blue-100 rounded-full">
            <CameraIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Fotoğraf/Video</p>
            <p className="text-xs text-gray-500">Galeriden seç veya çek</p>
          </div>
        </button>

        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors text-left"
          onClick={() => {/* Dosya gönderme fonksiyonu */}}
        >
          <div className="p-2 bg-purple-100 rounded-full">
            <DocumentIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Dosya</p>
            <p className="text-xs text-gray-500">PDF, Word, Excel gönder</p>
          </div>
        </button>

        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors text-left"
          onClick={() => {/* Konum gönderme fonksiyonu */}}
        >
          <div className="p-2 bg-green-100 rounded-full">
            <MapPinIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Konum</p>
            <p className="text-xs text-gray-500">Mevcut konumunu paylaş</p>
          </div>
        </button>
      </div>
    </div>
  )}
</div>
  )
}

export default MessageInput
