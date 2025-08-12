"use client"    
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React from 'react'
function SearchInput({ searchTerm, setSearchTerm} : { searchTerm: string, setSearchTerm: React.Dispatch<React.SetStateAction<string>>}) {

  return (
   <div className="flex p-2 rounded-full  relative">
           <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
           <input
             type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Kullanıcı ya da mesaj ara..."
             className="w-full pl-10 pr-3 py-2 bg-transparent dark:bg-gray-700  focus:outline-none"
           />
         </div>
  )
}

export default SearchInput
