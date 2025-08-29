"use client";
import { useUser } from "@/app/context/UserContext";
import { CameraIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { handleUpload } from "../../utils/UpdateAvatar"
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";
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
    toast.error("Kullanıcı e-posta adresi bulunamadı.");
    return;
  }

  try {
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: values.name,
        avatar_url: values.avatar_url,
      },
    });

    if (authError) throw authError;

    const { error: tableError } = await supabase
      .from('users')
      .update({
        id: user.id,
        name: values.name,
        avatar_url: values.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (tableError) {
      console.error("Users tablosu güncelleme hatası:", tableError);
    }

    const { data: refreshedUser, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !refreshedUser?.user) {
      throw getUserError || new Error("Kullanıcı bilgisi alınamadı.");
    }
if (typeof window !== 'undefined') {
      localStorage.removeItem('sb-auth-state');
    }
    setUser(refreshedUser.user);
    toast.success("Profil başarıyla güncellendi!");
  } catch (error) {
    console.error("Profil güncellenemedi:", error);
    toast.error("Profil güncellenemedi.");
  }
}

  },
  
);
  useEffect(() => {
      if (!user?.id) return; 
 const getusers = async () => {
  const { data, error } = await supabase
    .from('users').select('*')
    .eq('id', user?.id);
  if (error) {
    console.error("Kullanıcı bilgileri alınamadı:", error);
    return;
  }
  if (data) {
   formik.setFieldValue("name", data?.[0]?.name || user.user_metadata?.name || "");
    formik.setFieldValue(
      "avatar_url",
      data?.[0]?.avatar_url || user.user_metadata?.avatar_url || ""
    );
  }
};
  getusers();
}, [user]);

  return (
   <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white  p-4 md:p-8 justify-center items-center">
  <form
    onSubmit={formik.handleSubmit}
    className="w-full max-w-4xl bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-8"
  >

    <div className="flex flex-col items-center md:items-start space-y-4">
      <div className="relative group">
        <img
          src={formik.values.avatar_url || user?.user_metadata?.avatar_url || "/5.jpg"}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20 shadow"
        />
        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
        className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium rounded-lg"
      >
        Profil Resmini Değiştir
      </label>
    </div>

    <div className="flex-1 space-y-6">
      <h2 className="text-2xl font-bold text-text-color">Profil Bilgileri</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium ">
            Ad Soyad
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 border bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus-ring focus:border-transparent bg-input-bg text-text-color"
              value={formik.values.name}
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
          <label className="block mb-1 text-sm font-medium">
            E-posta Adresi
          </label>
          <div className="relative">
            <input
              type="email"
              disabled
              onChange={formik.handleChange}
              name="email"
              className="w-full p-3 border border-input-border bg-gray-100 dark:bg-gray-800  rounded-lg  cursor-not-allowed"
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
            className="w-full bg-indigo-600 text-white cursor:pointer hover:bg-indigo-700 md:w-auto px-6 py-2.5  font-medium rounded-lg  transition-colors"
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
