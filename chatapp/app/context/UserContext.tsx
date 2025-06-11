"use client";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSessionUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }
      setLoading(false);
    };

    getSessionUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
