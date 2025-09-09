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
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(serverSession);
  const [loading, setLoading] = useState(!serverSession);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      //supabase.realtime.setAuth(null); 
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
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);

      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      }
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setSession(session);
        setLoading(false);

        if (session?.access_token) {
          supabase.realtime.setAuth(session.access_token);
        } else {
          supabase.realtime.setAuth(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
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
        session,
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