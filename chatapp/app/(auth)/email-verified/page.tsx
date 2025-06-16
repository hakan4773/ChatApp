"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Page() {
  const router = useRouter();
  const [status, setStatus] = useState({ 
    message: "Doğrulama yapılıyor...", 
    isSuccess: false 
  });
 
  useEffect(() => {
    const verifyAndInsertUser = async () => {
      try {
        // 1. Kullanıcıyı al
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error(userError?.message || "Kullanıcı bilgileri alınamadı");
        }

        // 2. Kullanıcı zaten doğrulanmış mı kontrol et
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("Oturum bulunamadı. Lütfen giriş yapın.");
        }

        // 3. Kullanıcıyı veritabanına ekle (eğer yoksa)
        const { error: insertError } = await supabase.from("users").upsert({
          id: user.id,
          name: user.user_metadata?.name,
          email: user.email,
          email_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

        if (insertError) throw insertError;

        setStatus({ 
          message: "E-posta başarıyla doğrulandı! Yönlendiriliyorsunuz...", 
          isSuccess: true 
        });
        
        // 4. Kullanıcıyı dashboard'a yönlendir
        setTimeout(() => router.push("/"), 3000);
      } catch (error:any) {
        console.error("Doğrulama hatası:", error);
        setStatus({ 
          message: error.message || "Doğrulama sırasında bir hata oluştu", 
          isSuccess: false 
        });
      }
    };

    verifyAndInsertUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-blue-400 to-indigo-900">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {status.isSuccess ? (
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        )}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {status.isSuccess ? "Doğrulama Başarılı!" : "Hata Oluştu"}
        </h2>
        <p className="text-gray-600 mb-6">{status.message}</p>
        
        {!status.isSuccess && (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Giriş Sayfasına Dön
          </button>
        )}
      </div>
    </div>
  );
}