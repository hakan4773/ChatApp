"use client"
import type { Metadata } from "next";
import  "../globals.css"
import LeftBar from  "../components/LeftBar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isOpen, setIsOpen] = useState(false);
  
  return (
     <div className="flex min-h-screen">
            {/* Sol Sabit Sidebar */} 
              <LeftBar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Sayfa içeriği */}
<main className={`flex-1 bg-gray-100 overflow-auto transition-all duration-300 ${isOpen ? 'pl-64' : 'pl-16'}`}>
              {children}
            </main>
          </div>
   
  );
}
