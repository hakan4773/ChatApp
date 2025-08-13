"use client";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import React, { useEffect, useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}


export default function page() {
    const { user } = useUser();
const [readNotifications, setReadNotifications] = useState(0); 
const [unreadNotifications, setUnreadNotifications] = useState(0);
const [notifications, setNotifications] = useState<Notification[]>([]);
 useEffect(() => {
   if (user?.id) getNotifications();
 }, [user?.id]);
    const getNotifications = async () => {
    if (!user?.id) return;
      const { data, error } = await supabase.from("notifications").select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
      if (error) console.error("Bildirimler alınamadı:", error.message);
      if (data) {
        setNotifications(data as Notification[]);
        setReadNotifications(data.filter((n) => n.is_read).length);
        setUnreadNotifications(data.filter((n) => !n.is_read).length);
      }
    };

    const readNotification = (id: number) => {
      supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === id ? { ...n, is_read: true } : n
            )
          );
          if (notifications.find((n) => n.id === id)?.is_read) return;
          setReadNotifications((prev) => prev + 1);
          setUnreadNotifications((prev) => prev - 1);
        });
    };
   const readAllNotification = async () => {
  if (!user?.id) return;
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Bildirimler okundu olarak işaretlenemedi:", error.message);
    return;
  }
  setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  setReadNotifications((prev) => prev + unreadCount);
  setUnreadNotifications(0);
};

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="p-4 justify-between flex">
        <h1 className="text-2xl font-bold dark:text-white">Bildirimler</h1>
        <div className="flex space-x-4">
          <p className="border border-gray-200 dark:text-white rounded-md  bg-green-500 dark:border-gray-700 px-4 py-2">
            Okunan ({readNotifications})
          </p>
          <p className="border border-gray-200 dark:text-white rounded-md bg-red-500 dark:border-gray-700 px-4 py-2">
            Okunmayan ({unreadNotifications})
          </p>
        </div>
      </div>
      <div className="p-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Hiç bildirim yok.</p>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 p-4 rounded-md shadow mb-4 flex flex-col"
            >
              <div className="flex  justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold dark:text-white">
                    {notification.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                </div>
                <div>
                  <button onClick={() => readNotification(notification.id)} 
                  className="mt-2 ml-auto px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors">
                  {notification.is_read ? "Okundu" : "Okundu olarak işaretle"}
                  </button>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}

        <div className="mt-4 space-x-4">
          <button onClick={readAllNotification} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Tümünü Oku
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
            Tümünü Sil
          </button>
        </div>
      </div>
    </div>
  );
}
