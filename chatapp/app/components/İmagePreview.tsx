'use client';

import React from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImagePreviewProps {
  previewUrl: string;
  onSend: () => void;
  onRemove: () => void;
}

const İmagePreview: React.FC<ImagePreviewProps> = ({ previewUrl, onSend, onRemove }) => {
  return (
    <div className="absolute bottom-16 left-4 bg-white p-2 rounded-lg shadow-lg border z-50">
      <img
        src={previewUrl}
        alt="Preview"
        className="w-32 h-32 object-cover"
      />

      <div className="absolute bottom-3 right-1">
        <button
          onClick={onSend}
          className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          title="Gönder"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        title="Kapat"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default İmagePreview;