"use client";
import React, { useState } from 'react'

interface AddChatNameProps {
  setOpenNameState: (open: boolean) => void;
   handleCreateGroupChat: (name: string) => void;
   name: string;
   setName: (name: string) => void;
}
const AddChatName = ({ setOpenNameState, handleCreateGroupChat, name, setName }: AddChatNameProps) => {

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) {
    alert("Lütfen bir sohbet adı girin.");
    return;
  }
  handleCreateGroupChat(name);
  setOpenNameState(false);
};
  return (
      <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 shadow-2xl">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-semibold mb-4">Sohbet Adı Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
            <label htmlFor="chatName" className="block text-sm font-medium text-gray-700">
                Sohbet Adı
            </label>
            <input
                type="text"
                id="chatName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Sohbet adını girin"
            />
            </div>
            <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
           >
            Ekle
            </button>
        </form>
        <button
            onClick={() => setOpenNameState(false)}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
            Kapat
        </button>
    </div>
    </div>
  )
}

export default AddChatName
