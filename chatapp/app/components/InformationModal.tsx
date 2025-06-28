"use client";

import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

type Member = {
  id: string;
  name: string;
  avatar_url: string;
  created_at: string;
};

type ChatInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chatName: string | null;
  members: Member[];
};

const InformationModal = ({ isOpen, onClose, chatName, members }: ChatInfoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Sohbet Bilgileri</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Kapat"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700">Grup Adı</h4>
            <p className="text-gray-900 mt-1">{chatName || "Belirtilmemiş"}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700">Üyeler ({members.length})</h4>
            <div className="space-y-3 mt-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="relative h-10 w-10">
                    <Image
                      src={member.avatar_url || "/5.jpg"}
                      fill
                      alt={member.name}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(member.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700">Oluşturulma Tarihi</h4>
            <p className="text-gray-900 mt-1">
              {members[0]?.created_at 
                ? new Date(members[0].created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : "Bilinmiyor"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;