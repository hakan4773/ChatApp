"use client"
import  "../globals.css"
import LeftBar from  "../components/LeftBar";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isChatPage = pathname.startsWith("/chats/");


  return (
     <div className="flex min-h-screen">
       <LeftBar isOpen={isOpen} setIsOpen={setIsOpen} /> 
       <main  
        className={`flex-1 overflow-auto transition-all duration-300 safe-area-padding ${
          isOpen ? "pl-0 md:pl-44" : `pl-0 md:pl-16 ${!isChatPage ? "pb-16 md:pb-0" : "pb-0"}`
        }`}>          
          {children}
            </main>

             {!isChatPage &&<BottomNav />} 
          </div>
   
  );
}
