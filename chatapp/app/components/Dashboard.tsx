"use client";
import React from "react";

import { useUser } from "../context/UserContext";
 function Dashboard() {
 const {user}=useUser();
  return (
     <div className="">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Hoş geldin, {user?.email}!</p>
      <p>Bu, kullanıcı panelinizdiraaaaaaaaaaaaaaaaa.</p>
    </div>
  );
}

export default Dashboard;
