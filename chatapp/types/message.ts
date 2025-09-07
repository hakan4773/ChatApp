export interface ReactionType {
  id?: string;        
  message_id: string; 
  user_id: string;    
  emoji: string;      
  created_at?: string;
}
export interface MessageType {
          id: string;
          chat_id:string;
          content: string;
          user_id: string;
          avatar_url?: string | null;
          location?: { lat: number; lng: number } | null;
          file_url?: string | null;
          image_url?: string;
          created_at: string;
          reply_to?:string;
          reactions?: ReactionType[];
}

export interface ChatInfoType {
        id: string;
        name: string | null;
        users: Array<{
        id: string;
        name: string | null;
        avatar_url: string | null;}>
}
export interface MembersType {
      id: string;
      name: string;
      avatar_url: string;
      email: string;
      created_at: string;
}