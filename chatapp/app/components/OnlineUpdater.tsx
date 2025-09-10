"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

export default function OnlineUpdater() {
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const updateLastSeen = async () => {
      const { error } = await supabase
        .from("users")
        .update({ last_seen: new Date().toISOString() } as any)
        .eq("id", userId);
      if (error) console.error("OnlineUpdater error:", error.message);
    };

    updateLastSeen();

    const interval = setInterval(updateLastSeen, 30000); 

    return () => clearInterval(interval);
  }, [userId]);

  return null;
}
