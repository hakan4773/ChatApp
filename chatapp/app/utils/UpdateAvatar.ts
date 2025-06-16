import { SupabaseClient, User } from "@supabase/supabase-js";

export const handleUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  user: User,
  setUser: Function,
  supabase: SupabaseClient
): Promise<string | null> => {
  const file = event.target.files?.[0];
  if (!file || !user) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Yükleme hatası:", uploadError.message);
    alert("Resim yüklenemedi.");
    return null;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const publicUrl = data?.publicUrl;

  if (!publicUrl) {
    alert("Public URL alınamadı.");
    return null;
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (updateError) {
    console.error("Metadata güncellenemedi:", updateError.message);
  } else {
    alert("Profil resmi başarıyla güncellendi!");
  }

  setUser((prev: User) => ({
    ...prev,
    user_metadata: {
      ...(prev.user_metadata || {}),
      avatar_url: publicUrl,
    },
  }));

  return publicUrl;
};
