// ../types/contactUser.ts
export interface UserNested {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}
export interface UserProps {
  contact_id: string;
  email: string;
  nickname: string;
  users: UserNested;
}
export interface FriendsProps{
   owner_id:string; // yeni eekledim karşololşı engellemede mesaj engelleme
    nickname:string;
    email:string;
    is_blocked:boolean;
    contact_id:string;
    users?:UserNested;
}
export interface OpenProps {
  setOpenUsers: (open: boolean) => void;
  onCreateChat: (selectedUsers: string[]) => void;
  name: string;
  setName: (name: string) => void;
}
export interface AddNewUsersProps {
    setOpenUsers: (open: boolean) => void;
    onUserAdded: (newUser: UserProps) => void;
}