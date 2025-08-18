// utils/notifyUsers.ts
import { supabase } from "@/app/lib/supabaseClient";
import { FriendsProps } from "@/types/contactUser";

export const notifyUsers = async ({
  members,
  blockedByMe,
  blockedMe,
  senderId,
  message,
}: {
  members: { id: string, name: string }[];
  blockedByMe: FriendsProps[];
  blockedMe: FriendsProps[];
  senderId: string;
  message: string;
}) => {
  const isBlockedBetween = (memberId: string) => {
    return blockedByMe.some(c => c.contact_id === memberId) || blockedMe.some(c => c.owner_id === memberId);
  };

  const recipients = members
    .filter(member => member.id !== senderId) 
    .filter(member => !isBlockedBetween(member.id)); 

  if (recipients.length === 0) return;
  const senderName = members.find(m => m.id === senderId)?.name || "Bilinmeyen";

  const { error } = await supabase.from("notifications").insert(
    recipients.map(member => ({
      user_id: member.id,
      type: "chat",
      title: `Yeni mesaj from ${senderName}`,
      message: message ? message : "Dosya gönderildi.",
      is_read: false,
      sender_id: senderId,
    }))
  );

  if (error) console.error("Notification eklenemedi:", error.message);
};
