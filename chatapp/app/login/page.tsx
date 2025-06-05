"use client";
import Link from "next/link";
import React from "react";
import { ChatBubbleLeftIcon, LanguageIcon } from "@heroicons/react/24/outline";

function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-400 to-indigo-900 flex flex-col lg:flex-row items-center justify-center p-4">
      {/* Header: Logo ve Dil Seçimi */}
      <div className="w-full flex justify-between items-center px-4 lg:px-12 py-4 absolute top-0 left-0 right-0">
        <Link href="/" className="flex items-center text-white text-3xl font-bold tracking-tight">
          <ChatBubbleLeftIcon className="h-8 w-8 mr-2" />
          CHATAPP
        </Link>
        <Link href="/" className="flex items-center text-white text-lg font-medium">
          <LanguageIcon className="h-6 w-6 mr-2" />
          EN
        </Link>
      </div>

      {/* Başlık ve Açıklama */}
      <div className="text-center lg:w-1/2 mt-16 lg:mt-0">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-lg text-gray-100 mt-4 max-w-md mx-auto">
          Connect with friends and family through chat and fun games.
        </p>
      </div>

      {/* Giriş Formu */}
      <div className="lg:w-1/2 max-w-md w-full mt-8 lg:mt-0">
        <form className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="ornek@ornek.com"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            Log In
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Page;