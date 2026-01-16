import { makeAutoObservable } from "mobx";
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

  constructor() {
    makeAutoObservable(this);
  }

  // Установить фильтр
  setFilter(key: "search" | "role", value: string) {
    this.filters[key] = value;
  }

  // Сбросить фильтры
  resetFilters() {
    this.filters = { search: "", role: "" };
  }

  // Загрузить пользователей с фильтрами
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

  // Изменить роль пользователя (user ↔ manager)
  async updateUserRole(userId: number, role: "manager" | "user") {
    this.loading = true;
    this.error = null;
    try {
      // Используем существующий endpoint PATCH /admin/users/{id}/role
      await api.patch(`/admin/users/${userId}/role`, { role });

      // Обновляем локально
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

  // Заблокировать пользователя
  async blockUser(userId: number) {
    try {
      await api.post(`/admin/users/${userId}/block`);

      // Обновляем локально
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

  // Разблокировать пользователя
  async unblockUser(userId: number) {
    try {
      await api.post(`/admin/users/${userId}/unblock`);

      // Обновляем локально
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

  // Обновить информацию о пользователе
  async updateUser(userId: number, data: Partial<User>) {
    this.loading = true;
    this.error = null;
    try {
      const response = await api.put(`/admin/users/${userId}`, data);

      // Обновляем локально
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

  // Удалить пользователя
  async deleteUser(userId: number) {
    try {
      await api.delete(`/admin/users/${userId}`);

      // Удаляем локально
      this.users = this.users.filter((u) => u.id !== userId);
      return true;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка удаления пользователя";
      throw error;
    }
  }

  // Получить пользователя по ID
  getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  // Получить пользователей по роли
  getUsersByRole(role: string): User[] {
    return this.users.filter((u) => u.role === role);
  }

  // Получить всех менеджеров
  get managers(): User[] {
    return this.getUsersByRole("manager");
  }

  // Получить всех обычных пользователей
  get regularUsers(): User[] {
    return this.getUsersByRole("user");
  }

  // Получить всех администраторов
  get admins(): User[] {
    return this.getUsersByRole("admin");
  }
}

export const userStore = new UserStore();
