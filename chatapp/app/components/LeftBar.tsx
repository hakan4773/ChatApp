import Link from 'next/link'
import React from 'react'
import {
  UserCircleIcon,
  CogIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
function LeftBar() {
  return (
     <div className="flex flex-col  h-screen bg-indigo-800 text-white shadow-xl fixed ">
      {/* Kullanıcı Bilgileri */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-600">
        <div className="flex items-center space-x-3">
          <img
            src={ '/5.jpg'} 
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <p className="text-lg font-semibold">
              Ahmet Yılmaz
            </p>
            <p className="text-sm text-indigo-200">
              ahmet.yilmaz@example.com
            </p>
          </div>
        </div>
      </div>

      {/* Menü Öğeleri */}
      <div className="flex flex-col gap-2 p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserCircleIcon className="w-6 h-6" />
          <span className="font-medium">Profil</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <CogIcon className="w-6 h-6" />
          <span className="font-medium">Ayarlar</span>
        </Link>
        <Link
          href="/users"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UsersIcon className="w-6 h-6" />
          <span className="font-medium">Kullanıcılar</span>
        </Link>
        <Link
          href="/games"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PuzzlePieceIcon className="w-6 h-6" />
          <span className="font-medium">Oyunlar</span>
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
          <span className="font-medium">Yardım</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <BellIcon className="w-6 h-6" />
          <span className="font-medium">Bildirimler</span>
        </Link>
        <button
        //   onClick={handleSignOut}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition-colors text-left"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}

export default LeftBar
