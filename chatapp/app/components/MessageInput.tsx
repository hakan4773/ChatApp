"use client"
import { CameraIcon, DocumentIcon, MapPinIcon, MicrophoneIcon, PaperAirplaneIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState,ChangeEvent  } from 'react'
import {isValidFileType } from '../utils/FileUtils'
import İmagePreview from './İmagePreview';
import { useLocation } from '../hooks/useLocation';
import AddVoiceMessage from './AddVoiceMessage';
interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  sendMessage: () => void;
  onSendImage: (file: File) => void;
  onSendFile: (file: File) => void;
  onSendLocation: (location: { lat: number; lng: number }) => void;
  onSendVoiceMessage?: (url: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage,onSendVoiceMessage, sendMessage ,onSendImage,onSendFile,onSendLocation }) => {
    const [openMethods,setOpenMethods]=useState(false);
     const [imagePreview, setImagePreview] = useState<string | null>(null);
     const imageInputRef = useRef<HTMLInputElement>(null);
     const fileInputRef = useRef<HTMLInputElement>(null);     
     const { location,getLocation,setLocation } = useLocation();
     const [openVoiceMessage, setOpenVoiceMessage] = useState(false);

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
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
     <div className="p-2 sm:p-4 border-t bg-white/80 dark:bg-gray-800/80 relative">
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
<div className="absolute bottom-14 left-2 sm:left-4 w-full max-w-xs bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-2 z-50">
            <MapPinIcon className="w-6 h-6 text-red-500" />
          <span className="text-sm text-gray-800 dark:text-gray-200">Konumunuz</span>
          <button 
            onClick={sendCurrentLocation}
            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setLocation(null)}
            className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}



  <div className="flex items-center space-x-1 sm:space-x-2 relative">
     <button onClick={() => setOpenVoiceMessage(!openVoiceMessage)}
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
          aria-label="Sesli mesaj"
        >
       <MicrophoneIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
     </button>
       {openVoiceMessage && <AddVoiceMessage onSendAudio={onSendVoiceMessage}/>}

    <button 
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      onClick={handleOpenMethods}
      aria-label="Daha fazla seçenek"
    >
      <PlusCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>

    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" &&  handleSend()}
      placeholder="Bir mesaj yazın..."
      className="flex-1 border rounded-full dark:text-gray-200 py-2 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-all text-sm sm:text-base" 
         />

     <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={`p-3 rounded-full transition-colors ${
            newMessage.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
          aria-label="Mesaj gönder"
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
  </div>

  {openMethods && (
    <div className="absolute bottom-16 left-12 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 z-20 w-56 border border-gray-100 dark:border-gray-700">
      <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-b border-r border-gray-200 dark:border-gray-700"></div>
      
      <div className="flex flex-col space-y-1">
        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left w-full"
          onClick={triggerImageInput}  
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <CameraIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-200">Fotoğraf/Video</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Galeriden seç veya çek</p>
          </div>
          <input 
            ref={imageInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="hidden" 
          />
        </button>
        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left"
          onClick={triggerFileInput}  
        >
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <DocumentIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleImageChange}
              className="hidden" 
            />
            <p className="font-medium text-gray-900 dark:text-gray-200">Dosya</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF, Word, Excel gönder</p>
          </div>
        </button>
        <button 
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left"
          onClick={getLocation}
        >
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <MapPinIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-200">Konum</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mevcut konumunu paylaş</p>
          </div>
        </button>
      </div>
    </div>
)}
</div>
  )
}

export default MessageInput
