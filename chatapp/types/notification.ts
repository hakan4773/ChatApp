export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
  sender_id?: string;
}