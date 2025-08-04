"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  name?: string;
  email?: string;
  role?: "student" | "university";
  universityName?: string;
  country?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(!!data.loggedIn);
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    }
  };

  return { isLoggedIn, user, loading, logout };
}
