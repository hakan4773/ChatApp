"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Sayfa Bulunamadı";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-8xl font-extrabold mb-4 text-red-500 dark:text-red-400 animate-pulse">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
        Üzgünüz, sayfa bulunamadı!
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-6 max-w-md">
        Aradığınız sayfa taşınmış olabilir veya yanlış bir URL girmiş olabilirsiniz.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
