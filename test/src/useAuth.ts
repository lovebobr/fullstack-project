import { useEffect, useState } from "react";
import { AuthService } from "./api/api.auth";
import type { User } from "./interfaces/aurh.interfaces";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await AuthService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await AuthService.login(email, password);
      localStorage.setItem("accessToken", token);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };
};
