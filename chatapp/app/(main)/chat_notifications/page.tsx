"use client";
import React, { useState } from "react";

export default function page() {
  const notifications = [
    {
      title: "Yeni mesaj",
      message: "Ali, sana yeni bir mesaj gönderdi.",
      date: "2023-10-01T12:00:00Z",
    },
    {
      title: "Güncelleme",
      message: "Sistem güncellemesi başarıyla tamamlandı.",
      date: "2023-10-02T14:30:00Z",
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="p-4 justify-between flex">
        <h1 className="text-2xl font-bold dark:text-white">Bildirimler</h1>
        <div className="flex space-x-4">
          <p className="border border-gray-200 dark:text-white rounded-md  bg-green-500 dark:border-gray-700 px-4 py-2">
            Okunan (0){" "}
          </p>
          <p className="border border-gray-200 dark:text-white rounded-md bg-red-500 dark:border-gray-700 px-4 py-2">
            Okunmayan (2)
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
                  <button className="mt-2 ml-auto px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors">
                    Okundu olarak işaretle
                  </button>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(notification.date).toLocaleString()}
              </span>
            </div>
          ))
        )}

        <div className="mt-4 space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
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
