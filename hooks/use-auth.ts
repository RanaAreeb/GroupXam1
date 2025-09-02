"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  name?: string;
  email?: string;
  role?: "student" | "university";
  universityName?: string;
  country?: string;
  profilePicture?: string;
  phone?: string;
  city?: string;
  school?: string;
  grade?: string;
  bio?: string;
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

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      const data = await res.json();
      setIsLoggedIn(!!data.loggedIn);
      setUser(data.user || null);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Add event listener for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-state-changed') {
        // Force immediate re-check of auth state
        checkAuth();
      }
    };

    // Also listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const logout = async (): Promise<void> => {
    // Update state immediately before making the API call
    setIsLoggedIn(false);
    setUser(null);
    
    try {
      // Make the logout API call
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      });
      
      // Trigger storage event to update other tabs
      localStorage.setItem('auth-state-changed', Date.now().toString());
      localStorage.removeItem('auth-state-changed');
      
      // Also dispatch a custom event for immediate updates in the same tab
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      // Force a slight delay to ensure state has propagated
      setTimeout(() => {
        router.push("/");
      }, 100);
      
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if API fails
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  };

  return { isLoggedIn, user, loading, logout };
}
