/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "./authStore";
import { getProfile, loginUser } from "./api";

type User = { name: string; email: string; venueManager?: boolean; avatarUrl?: string };
type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      // token inneholder brukernavn i payloaden i Noroff? Vi henter fra /auth/login-svar normalt,
      // men siden vi persisterer kun token lokalt her, legger vi et lite fallback:
      // lagre brukernavn i localStorage når du logger inn (se login()).
      const name = localStorage.getItem("holidaze:username") ?? "";
      if (!name) return;
      const p = await getProfile(name);
      setUser({
        name: p.name,
        email: p.email,
        venueManager: p.venueManager,
        avatarUrl: p.avatar?.url,
      });
    } catch {
      setUser(null);
      clearToken();
      localStorage.removeItem("holidaze:username");
    }
  }

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    setToken(res.accessToken);
    localStorage.setItem("holidaze:username", res.name);

    try {
      const p = await getProfile(res.name);
      setUser({
        name: p.name,
        email: p.email,
        venueManager: p.venueManager,
        avatarUrl: p.avatar?.url,
      });
    } catch {
      setUser({
        name: res.name,
        email: res.email,
        venueManager: res.venueManager,
        avatarUrl: res.avatar?.url,
      });
    }
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("holidaze:username");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}