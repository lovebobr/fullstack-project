import { api } from "../../shared/lib/axios";
import type { User } from "../../interfaces/aurh.interfaces";

class UserStore {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  filters = {
    search: "",
    role: "",
  };

  async loadUsers() {
    this.loading = true;
    this.error = null;
    try {
      const params = new URLSearchParams();
      if (this.filters.search.trim()) {
        params.append("search", this.filters.search.trim());
      }
      if (this.filters.role) {
        params.append("role", this.filters.role);
      }

      const url = `/admin/users${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await api.get(url);
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
      await api.patch(`/admin/users/${userId}/role`, { role });
      const userIndex = this.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex].role = role;
      }

      return true;
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
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.is_blocked = true;
      }
      return true;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка блокировки пользователя";
      throw error;
    }
  }
  async unblockUser(userId: number) {
    try {
      await api.post(`/admin/users/${userId}/unblock`);

      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.is_blocked = false;
      }
      return true;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка разблокировки пользователя";
      throw error;
    }
  }

  async updateUser(userId: number, data: Partial<User>) {
    this.loading = true;
    this.error = null;
    try {
      const response = await api.put(`/admin/users/${userId}`, data);

      const userIndex = this.users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...data };
      }

      return response.data;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка обновления пользователя";
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(userId: number) {
    try {
      await api.delete(`/admin/users/${userId}`);

      this.users = this.users.filter((u) => u.id !== userId);
      return true;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка удаления пользователя";
      throw error;
    }
  }
}

export const userStore = new UserStore();
