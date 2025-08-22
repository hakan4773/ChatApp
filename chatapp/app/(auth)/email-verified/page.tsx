"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
   const [status, setStatus] = useState("Doğrulama kontrol ediliyor...");
useEffect(() => {
    const checkVerification = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setStatus("Email doğrulandı! Lütfen giriş yapın.");
        return;
      }

      const user = userData.user;

      if (user.email_confirmed_at) {
        setStatus("Email başarıyla doğrulandı ve kullanıcı DB'ye kaydedildi! Yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setStatus("Doğrulama başarısız oldu.");
      }
    };

    checkVerification();
  }, [router]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-blue-400 to-indigo-900">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {status}
        </h2>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Giriş Sayfasına Dön
        </button>
      </div>
    </div>
  );
}