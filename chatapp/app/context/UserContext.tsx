"use client";
import { User, Session } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  serverSession = null,
}: {
  children: ReactNode;
  serverSession?: Session | null;
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter(); 
  const [user, setUser] = useState<User | null>(serverSession?.user ?? null);
  const [loading, setLoading] = useState(!serverSession);


 const signOut = async () => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    router.push("/login");
  } catch (error: any) {
    console.error('Error signing out:', error.message);
  } finally {
    setLoading(false);
  }
};


  const refreshUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      setUser({ ...data.user });
    }
  };

  useEffect(() => {
    const init = async () => {
      if (serverSession) return;

      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
