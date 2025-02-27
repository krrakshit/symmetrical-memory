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

  const updateAuthState = useCallback(async (newState: { isAuthenticated: boolean; user: any | null; token: string | null }) => {
    await setAuth(newState);
    if (newState.isAuthenticated) {
      setPage("Dashboard");
    } else {
      setPage("Login");
    }
  }, [setAuth, setPage]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await AuthService.login({ email, password });
        
        // Update auth state
        await updateAuthState({ 
          isAuthenticated: true, 
          user: response.user,
          token: response.token 
        });

        // Force reload after successful login
        window.location.reload();
      } catch (error) {
        // Clear auth state on error
        await updateAuthState({ 
          isAuthenticated: false, 
          user: null, 
          token: null 
        });
        throw error;
      }
    },
    [updateAuthState],
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
      // Clear auth state
      await updateAuthState({ 
        isAuthenticated: false, 
        user: null, 
        token: null 
      });
      // Force reload after successful logout
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [updateAuthState]);

  const checkAuth = useCallback(async () => {
    try {
      const result = await AuthService.checkAuth();
      
      if (result.isAuthenticated && result.user) {
        await updateAuthState({ 
          isAuthenticated: true, 
          user: result.user,
          token: localStorage.getItem("token") 
        });
        return { isAuthenticated: true, user: result.user };
      } else {
        await updateAuthState({ 
          isAuthenticated: false, 
          user: null, 
          token: null 
        });
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      await updateAuthState({ 
        isAuthenticated: false, 
        user: null, 
        token: null 
      });
      return { isAuthenticated: false, user: null };
    }
  }, [updateAuthState]);

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login,
    signup,
    logout,
    checkAuth,
  };
}
