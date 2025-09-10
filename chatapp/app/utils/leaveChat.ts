import { supabase } from "../lib/supabaseClient";
interface ChatMembersType{
    chatId:string;
    userId:string
}
export  async function leaveChat({chatId,userId}:ChatMembersType) : Promise<boolean>{
await supabase.from("messages").delete().eq("chat_id", chatId);
await supabase.from("message_reactions").delete().eq("chat_id", chatId).eq("user_id", userId);
  const { error } = await supabase
    .from("chat_members")
    .delete()
    .eq("chat_id", chatId)
    .eq("user_id", userId);

  if (error) {
    console.error("Gruptan çıkılamadı:", error.message);
    return false;
  }

    return true;

}