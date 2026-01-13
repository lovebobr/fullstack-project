import { api } from "../shared/lib/axios";
import type { User } from "../interfaces/aurh.interfaces";

export const AuthService = {
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    try {
      const { data } = await api.post<{ user: User; token: string }>(
        "/register",
        {
          name,
          email,
          password,
          password_confirmation: password,
        }
      );

      console.log("Server response:", data);

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      return { user: data.user, token: data.token };
    } catch (error: any) {
      console.log("Register error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // 1. Получаем токен
    const { data: authData } = await api.post<{ token: string }>("/login", {
      email,
      password,
    });

    console.log("🔍 Login response:", authData);

    if (!authData?.token) {
      throw new Error("Неверные учетные данные");
    }

    // 2. Сохраняем токен в axios для последующих запросов
    api.defaults.headers.common["Authorization"] = `Bearer ${authData.token}`;

    // 3. Получаем данные пользователя
    const { data: userData } = await api.get<User>("/user");

    return { user: userData, token: authData.token };
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>("/user");
    return data;
  },

  async logout() {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
    }
  },
};
