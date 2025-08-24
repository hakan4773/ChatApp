"use client"    
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React from 'react'
function SearchInput({ searchTerm, setSearchTerm} : { searchTerm: string, setSearchTerm: React.Dispatch<React.SetStateAction<string>>}) {

  return (
   <div className="flex p-2 rounded-full w-full lg:w-auto  relative">
           <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
           <input
             type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Kullanıcı ya da mesaj ara..."
            className="w-full lg:w-64 px-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
           />
         </div>
  )
}

export default SearchInput
