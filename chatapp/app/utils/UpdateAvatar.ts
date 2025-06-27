import { SupabaseClient, User } from "@supabase/supabase-js";

export const handleUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  user: User,
  setUser: Function,
  supabase: SupabaseClient
): Promise<string | null> => {
  const file = event.target.files?.[0];
  if (!file || !user) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `avatar.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;
  const bucket = "avatars";

  try {
    // ✅ 1. Eski dosyayı sil
    const { data: listData, error: listError } = await supabase.storage
      .from(bucket)
      .list(user.id + "/", { limit: 100 });

    if (listError) {
      console.warn("Eski dosya listelenemedi:", listError.message);
    } else {
      for (const file of listData || []) {
        // sadece avatar dosyalarını sil (opsiyonel filtre)
        if (file.name.startsWith("avatar")) {
          await supabase.storage.from(bucket).remove([`${user.id}/${file.name}`]);
        }
      }
    }

    // ✅ 2. Yeni dosyayı yükle
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Yükleme hatası:", uploadError.message);
      return null;
    }

    // ✅ 3. Public URL al + cache busting
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    let publicUrl = data?.publicUrl;
    if (!publicUrl) return null;

    publicUrl += `?t=${Date.now()}`; // cache kırıcı

    return publicUrl;
  } catch (error) {
    console.error("Profil resmi güncelleme hatası:", error);
    return null;
  }
};
