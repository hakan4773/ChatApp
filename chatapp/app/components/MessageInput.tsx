"use client"
import { CameraIcon, DocumentIcon, MapPinIcon, MicrophoneIcon, PaperAirplaneIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState,ChangeEvent  } from 'react'
import {isValidFileType } from '../utils/FileUtils'
import İmagePreview from './İmagePreview';
import { useLocation } from '../hooks/useLocation';
interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
  onSendImage: (file: File) => void;
  onSendFile: (file: File) => void;
  onSendLocation: (location: { lat: number; lng: number }) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, sendMessage ,onSendImage,onSendFile,onSendLocation }) => {
    const [openMethods,setOpenMethods]=useState(false);
     const [imagePreview, setImagePreview] = useState<string | null>(null);
     //referanslar
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);     
   //konum gönderme fonksiyonu
     const { location,getLocation,setLocation } = useLocation();

  const sendCurrentLocation = () => {
    if (location) {
      onSendLocation(location);
    }
  };
    

    const handleOpenMethods=()=>{
        setOpenMethods(!openMethods);
    }

  //resim gösterme
 const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    //sadece resimler

    const error = isValidFileType(file);
  if (error) {
    alert(error);
    return;
  }

  const isImage = file.type.startsWith('image/');
  
  if (isImage) {
    // Resim önizleme göster
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  } else {
    onSendFile(file);
    e.target.value = ''; 
  }

  };
  // dosya yükleme tetikleme
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Resim yükleme tetikleme
const triggerImageInput = () => {
  imageInputRef.current?.click();
};

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage();
      setNewMessage('');
    }
  };

  const removePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  return (
     <div className="p-4 border-t bg-white relative">
              {/* Resim önizleme */}
    {imagePreview && (
  <İmagePreview
    previewUrl={imagePreview}
    onSend={() => {
      const file = imageInputRef.current?.files?.[0];
      if (file) {
        onSendImage(file);
        removePreview();
      }
    }}
    onRemove={removePreview}
  />
)}
{location && (
        <div className="absolute bottom-16 left-4 bg-white p-2 rounded-lg shadow-lg border flex items-center space-x-2 z-50">
          <MapPinIcon className="w-6 h-6 text-red-500" />
          <span className="text-sm">Konumunuz</span>
          <button 
            onClick={sendCurrentLocation}
            className="p-1 bg-blue-500 text-white rounded-full"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setLocation(null)}
            className="p-1 bg-gray-200 rounded-full"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}



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
      onKeyDown={(e) => e.key === "Enter" &&  handleSend()}
      placeholder="Bir mesaj yazın..."
      className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />

    {/* Gönder butonu */}
    <button
    onClick={handleSend}
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
    {/*Resim gönderme fonksiyonu*/}
    <button 
  className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors text-left w-full"
  onClick={triggerImageInput}  
>
  <div className="p-2 bg-blue-100 rounded-full">
    <CameraIcon className="w-5 h-5 text-blue-600" />
  </div>
  <div>
    <p className="font-medium text-gray-900">Fotoğraf/Video</p>
    <p className="text-xs text-gray-500">Galeriden seç veya çek</p>
  </div>
  <input 
    ref={imageInputRef}
    type="file" 
    accept="image/*" 
    onChange={handleImageChange}
    className="hidden" 
  />
</button>
    {/*Dosya gönderme fonksiyonu*/}

        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors text-left"
         onClick={triggerFileInput}  

          >
          <div className="p-2 bg-purple-100 rounded-full">
            <DocumentIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
      <input 
  ref={fileInputRef}
  type="file" 
  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
  onChange={handleImageChange}
  className="hidden" 
/>
            <p className="font-medium text-gray-900">Dosya</p>
            <p className="text-xs text-gray-500">PDF, Word, Excel gönder</p>
          </div>
        </button>
 {/* Konum gönderme fonksiyonu */}
        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 transition-colors text-left"
       onClick={getLocation}
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
