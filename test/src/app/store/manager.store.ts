import { makeAutoObservable } from "mobx";
import { api } from "../../shared/lib/axios";

export interface Manager {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_blocked: boolean;
  role?: string; // Добавим поле role
  restaurants?: Restaurant[];
  created_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
}

class ManagerStore {
  managers: Manager[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadManagers() {
    this.loading = true;
    this.error = null;
    try {
      const response = await api.get("/admin/managers");
      this.managers = response.data;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка загрузки менеджеров";
    } finally {
      this.loading = false;
    }
  }

  async createManager(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    this.loading = true;
    this.error = null;
    try {
      await api.post("/admin/managers", data);
      await this.loadManagers(); // Перезагружаем список после создания
    } catch (error: any) {
      this.error = error.response?.data?.message || "Ошибка создания менеджера";
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // ДОБАВЛЯЕМ МЕТОД ДЛЯ ОБНОВЛЕНИЯ МЕНЕДЖЕРА
  async updateManager(
    id: number,
    data: {
      name: string;
      email: string;
      phone?: string;
    }
  ) {
    this.loading = true;
    this.error = null;
    try {
      const response = await api.put(`/admin/users/${id}`, {
        ...data,
        role: "manager",
      });

      const managerIndex = this.managers.findIndex((m) => m.id === id);
      if (managerIndex !== -1) {
        this.managers[managerIndex] = {
          ...this.managers[managerIndex],
          name: data.name,
          email: data.email,
          phone: data.phone || this.managers[managerIndex].phone,
        };
      }

      return response.data;
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка обновления менеджера";
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async assignRestaurant(managerId: number, restaurantId: number) {
    this.loading = true;
    this.error = null;
    try {
      await api.post(`/admin/managers/${managerId}/assign-restaurant`, {
        restaurant_id: restaurantId,
      });
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка назначения ресторана";
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async blockManager(id: number) {
    try {
      await api.post(`/admin/managers/${id}/block`);
      await this.loadManagers(); // Обновляем список после блокировки
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка блокировки менеджера";
      throw error;
    }
  }

  async unblockManager(id: number) {
    try {
      await api.post(`/admin/managers/${id}/unblock`);
      await this.loadManagers(); // Обновляем список после разблокировки
    } catch (error: any) {
      this.error =
        error.response?.data?.message || "Ошибка разблокировки менеджера";
      throw error;
    }
  }

  async deleteManager(id: number) {
    try {
      await api.delete(`/admin/managers/${id}`);
      await this.loadManagers(); // Обновляем список после удаления
    } catch (error: any) {
      this.error = error.response?.data?.message || "Ошибка удаления менеджера";
      throw error;
    }
  }
}

export const managerStore = new ManagerStore();
