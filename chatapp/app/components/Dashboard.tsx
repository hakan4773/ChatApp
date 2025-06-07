"use client";
import { useUser } from "@/app/context/UserContext";
import React from "react";

 function dashboard() {
 const {user}=useUser();
 console.log(user)
  return (
     <div className="">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Hoş geldin, {user?.email}!</p>
      <p>Bu, kullanıcı panelinizdiraaaaaaaaaaaaaaaaa.</p>
    </div>
  );
}

export default dashboard;
