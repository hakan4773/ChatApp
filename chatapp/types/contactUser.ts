// ../types/contactUser.ts
export interface UserNested {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}
export interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  nickname: string;
  users: UserNested;
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