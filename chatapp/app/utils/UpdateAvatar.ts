    "use client"
import { useState } from "react";
import { SupabaseClient, User } from "@supabase/supabase-js";

    
export const handleUpload = async (  event: React.ChangeEvent<HTMLInputElement>,
  user: User,
  setUser: Function,
  supabase: SupabaseClient
) => {
 const file=event.target.files?.[0];
   if (!file || !user) return;
    const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
const filePath = `${user.id}/${fileName}`;

      await supabase.storage.from('avatars').remove([filePath])

 //Supabase deposuna yükle
    const {error:uploadError}=await supabase.storage.from("avatars").upload(filePath,file,{
        upsert: true,
        contentType: file.type,
    });
    if(uploadError){
        console.error("Upload error:", uploadError.message);
      alert("Yükleme başarısız");
      return;
    }
     // Public URL oluştur
const {data:{publicUrl}}=supabase.storage.from("avatars").getPublicUrl(filePath)

    // 3. Auth metadata güncelle
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });
    if (updateError) {
      console.error("Metadata güncellenemedi:", updateError.message);
    }

    setUser({
        ...user,
        user_metadata:{
        ...user.user_metadata,
       avatar_url: publicUrl,

        }
    });

};
