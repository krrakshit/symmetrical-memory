// frontend/src/hooks/useAuth.ts

import { useAtom } from "jotai";
import { useCallback } from "react";
import { authAtom } from "@/atoms/authAtom";
import { pageAtom } from "@/atoms/pageAtom";
import * as AuthService from "@/services/auth.service";

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: AuthService.SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<{ isAuthenticated: boolean; user: any | null }>;
}

export function useAuth(): UseAuthReturn {
  const [auth, setAuth] = useAtom(authAtom);
  const [, setPage] = useAtom(pageAtom);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await AuthService.login({ email, password });
        
        // Store auth state with token
        await setAuth({ 
          isAuthenticated: true, 
          user: response.user,
          token: response.token 
        });

        // Navigate to dashboard immediately after auth state is set
        setPage("Dashboard");
      } catch (error) {
        // Clear auth state on error
        setAuth({ isAuthenticated: false, user: null, token: null });
        throw error;
      }
    },
    [setAuth, setPage],
  );

  const signup = useCallback(
    async (userData: AuthService.SignupData) => {
      try {
        await AuthService.signup(userData);
        setPage("Login");
      } catch (error) {
        console.error("Signup failed:", error);
        throw error;
      }
    },
    [setPage],
  );

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear auth state and redirect
      setAuth({ isAuthenticated: false, user: null, token: null });
      setPage("Login");
    }
  }, [setAuth, setPage]);

  const checkAuth = useCallback(async () => {
    try {
      const result = await AuthService.checkAuth();
      
      if (result.isAuthenticated && result.user) {
        setAuth({ 
          isAuthenticated: true, 
          user: result.user,
          token: localStorage.getItem("token") 
        });
        return { isAuthenticated: true, user: result.user };
      } else {
        setAuth({ isAuthenticated: false, user: null, token: null });
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      setAuth({ isAuthenticated: false, user: null, token: null });
      return { isAuthenticated: false, user: null };
    }
  }, [setAuth]);

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login,
    signup,
    logout,
    checkAuth,
  };
}
