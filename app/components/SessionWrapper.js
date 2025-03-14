"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn, signOut } from "next-auth/react";

const SessionContext = createContext();

export function SessionWrapper({ children }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession();
      setSession(data);
      setLoading(false);
    };
    fetchSession();
  }, []);

  const login = async (email, password) => {
    const result = await signIn("credentials", { redirect: false, email, password });
    if (!result.error) {
      const newSession = await getSession();
      setSession(newSession);
    }
    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setSession(null);
    router.push("/login"); // ✅ Redirect to login after logout
  };

  return (
    <SessionContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
