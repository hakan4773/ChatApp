"use client";
import { useUser } from "@/app/context/UserContext";
import React from "react";

 function dashboard() {
 const {user}=useUser();
 console.log(user)
  return (
     <div className="w-full  p-6 bg-white shadow-md rounded-lg ">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Hoş geldin, {user?.email}!</p>
      <p>Bu, kullanıcı panelinizdiraaaaaaaaaaaaaaaaa.</p>
    </div>
  );
}

export default dashboard;
