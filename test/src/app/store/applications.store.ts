import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../../shared/lib/axios";

export interface Application {
  id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  restaurant_id: number;
  restaurant_name: string;
  table_id: number;
  table_number: number;
  date_time: string;
  duration: number;
  guests_count: number;
  price: number;
  status: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  foods?: any[];
}

class ApplicationsStore {
  applications: Application[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadApplications() {
    this.loading = true;
    this.error = null;
    try {
      const response = await api.get("/admin/reservations");
      this.applications = this.normalizeApplications(response.data);
    } catch (error: any) {
      this.error = this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private normalizeApplications(data: any): Application[] {
    if (!data || !Array.isArray(data)) return [];

    return data.map((reservation: any) => {
      const user = reservation.user || {};
      const table = reservation.table || {};
      const restaurant = reservation.restaurant || table.restaurant || {};

      return {
        id: reservation.id?.toString() || "",
        user_id: reservation.user_id || user.id || 0,
        user_name: user.name || reservation.user_name || "Неизвестный",
        user_email: user.email || reservation.user_email || "",
        user_phone: user.phone || reservation.user_phone || "",
        restaurant_id:
          reservation.restaurant_id ||
          table.restaurant_id ||
          restaurant.id ||
          0,
        restaurant_name: restaurant.name || "Ресторан",
        table_id: reservation.table_id || table.id || 0,
        table_number: table.number || table.table_number || 0,
        date_time: reservation.date_time || "",
        duration: reservation.duration || 2,
        guests_count: reservation.guests_count || 1,
        price: reservation.price || 0,
        status: reservation.status || "pending",
        special_requests: reservation.special_requests || "",
        created_at: reservation.created_at || new Date().toISOString(),
        updated_at: reservation.updated_at || new Date().toISOString(),
        foods: reservation.foods || [],
      };
    });
  }

  // ПРОСТАЯ ОТМЕНА БРОНИ
  async cancelApplication(applicationId: string) {
    try {
      // Пробуем через админский endpoint
      const response = await api.put(`/admin/reservations/${applicationId}`, {
        status: "canceled",
      });

      // Обновляем локально
      runInAction(() => {
        const index = this.applications.findIndex(
          (app) => app.id === applicationId
        );
        if (index !== -1) {
          this.applications[index].status = "canceled";
        }
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      // Если админский не работает, пробуем обычный
      try {
        await api.post(`/reservations/${applicationId}/cancel`);

        runInAction(() => {
          const index = this.applications.findIndex(
            (app) => app.id === applicationId
          );
          if (index !== -1) {
            this.applications[index].status = "canceled";
          }
        });

        return { success: true };
      } catch (secondError: any) {
        this.error = "Не удалось отменить бронь";
        return { success: false, error: this.error };
      }
    }
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    try {
      await api.put(`/admin/reservations/${applicationId}`, { status });

      runInAction(() => {
        const index = this.applications.findIndex(
          (app) => app.id === applicationId
        );
        if (index !== -1) {
          this.applications[index].status = status;
        }
      });

      return { success: true };
    } catch (error: any) {
      this.error = "Ошибка обновления статуса";
      return { success: false, error: this.error };
    }
  }

  async deleteApplication(applicationId: string) {
    try {
      await api.delete(`/admin/reservations/${applicationId}`);

      runInAction(() => {
        this.applications = this.applications.filter(
          (app) => app.id !== applicationId
        );
      });

      return { success: true };
    } catch (error: any) {
      this.error = "Ошибка удаления";
      return { success: false, error: this.error };
    }
  }

  private getErrorMessage(error: any): string {
    if (error.response) {
      return error.response.data?.message || `Ошибка ${error.response.status}`;
    }
    return error.message || "Неизвестная ошибка";
  }

  clearError() {
    this.error = null;
  }
}

export const applicationsStore = new ApplicationsStore();
