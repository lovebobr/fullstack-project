import { makeAutoObservable } from "mobx";
import { api } from "../../shared/lib/axios";
import type { User } from "../../interfaces/aurh.interfaces";
//будет нужен в будущем
class UserStore {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadUsers() {
    this.loading = true;
    this.error = null;
    try {
      const response = await api.get("/admin/users");
      this.users = response.data;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка загрузки пользователей";
      console.error("Ошибка загрузки пользователей:", error);
    } finally {
      this.loading = false;
    }
  }

  async updateUserRole(userId: number, role: "manager" | "user") {
    this.loading = true;
    this.error = null;
    try {
      // Используем существующий endpoint для блокировки/разблокировки пользователя
      // или создаем новый endpoint для изменения роли
      const response = await api.post(`/admin/users/${userId}/update-role`, {
        role: role,
      });

      // Обновляем локально
      const userIndex = this.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex].role = role;
      }

      return response.data;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка изменения роли пользователя";
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async blockUser(userId: number) {
    try {
      await api.post(`/admin/users/${userId}/block`);
      // Обновляем локально
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.is_blocked = true;
      }
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка блокировки пользователя";
      throw error;
    }
  }

  async unblockUser(userId: number) {
    try {
      await api.post(`/admin/users/${userId}/unblock`);
      // Обновляем локально
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.is_blocked = false;
      }
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка разблокировки пользователя";
      throw error;
    }
  }
}

export const userStore = new UserStore();
