"use client";
import { useUser } from "@/app/context/UserContext";
import { CameraIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import { User } from "@supabase/supabase-js";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { handleUpload } from "../../utils/UpdateAvatar"
import { supabase } from "@/app/lib/supabaseClient";
type ProfileFormValues = {
    name: string;
    avatar_url:string
 };
function page() {
  const { user, setUser ,refreshUser} = useUser();

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      name: user?.user_metadata?.name || "",
      avatar_url: user?.user_metadata?.avatar_url || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!user?.email) {
        alert("Kullanıcı e-posta adresi bulunamadı.");
        return;
      }
try {
  
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: values.name,
          avatar_url: values.avatar_url,
        },
      });

      const { data,error: dbError } = await supabase
        .from("users")
        .update({
          name: values.name,
          avatar_url: values.avatar_url,
        })
        .eq("id",user.id)
console.log("Update result:", { data, dbError, status });

      if (authError || dbError) {
        console.error("Profil güncelleme hatası:", authError || dbError);
        alert("Profil güncellenemedi.");
        return;
      }
await refreshUser();

const { data: updatedProfiles } = await supabase
  .from("users")
  .select("*")
  .eq("id", user.id);

if (updatedProfiles && updatedProfiles.length > 0) {
  setUser({
    ...user,
    user_metadata: {
      ...user.user_metadata,
      name: updatedProfiles[0].name,
      avatar_url: updatedProfiles[0].avatar_url,
    }
  });
    }    alert("Profil başarıyla güncellendi!");
}
       catch (error) {
   alert("Profil güncellenemedi.");

}
    },
    
  }
);


  return (
    <div className="flex min-h-screen bg-gray-50 p-4 md:p-8 justify-center items-start">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8"
      >
        {/* Profil resmi*/}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="relative group">
            <img
              src={user?.user_metadata?.avatar_url}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <CameraIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <input
            type="file"
            id="profile-pic-upload"
            className="hidden"
            onChange={async (e) => {
              if (user) {
                const newUrl = await handleUpload(e, user, setUser, supabase);
                if (newUrl) {
                  formik.setFieldValue("avatar_url", newUrl);
                   await refreshUser();
                }
              }
            }}
          />
          <label
            htmlFor="profile-pic-upload"
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Profil Resmini Değiştir
          </label>
        </div>

        {/* Profil bilgileri */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Profil Bilgileri</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Ad Soyad
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  value={formik.values.name }
                  onChange={formik.handleChange}
                  name="name"
                  placeholder="Kullanıcı Adı"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  onChange={formik.handleChange}
                  name="email"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-100"
                  value={user?.email || "email@example.com"}
                  readOnly
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Profili Güncelle
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default page;
