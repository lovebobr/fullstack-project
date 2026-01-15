// applications.store.ts
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
}

class ApplicationsStore {
  applications: Application[] = [];
  loading = false;
  error: string | null = null;
  lastLoaded: Date | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadApplications() {
    this.loading = true;
    this.error = null;

    try {
      console.log("🔄 Загрузка бронирований из /admin/reservations");
      const response = await api.get("/admin/reservations");

      console.log("✅ Ответ получен:", {
        status: response.status,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataSample: Array.isArray(response.data)
          ? response.data[0]
          : response.data,
      });

      runInAction(() => {
        this.applications = this.normalizeApplications(response.data);
        this.lastLoaded = new Date();
      });

      console.log(`✅ Загружено ${this.applications.length} бронирований`);
    } catch (error: any) {
      console.error("❌ Ошибка загрузки бронирований:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      runInAction(() => {
        this.error = this.getErrorMessage(error);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private normalizeApplications(data: any): Application[] {
    console.log("🔍 normalizeApplications получила:", {
      data: data,
      type: typeof data,
      isArray: Array.isArray(data),
    });

    // Извлекаем массив бронирований из различных форматов
    let reservationsArray: any[] = [];

    if (Array.isArray(data)) {
      // Формат 1: Просто массив
      reservationsArray = data;
    } else if (data && typeof data === "object") {
      // Формат 2: { data: [...] }
      if (Array.isArray(data.data)) {
        reservationsArray = data.data;
        console.log("📦 Извлечен массив из data.data");
      }
      // Формат 3: { reservations: [...] }
      else if (Array.isArray(data.reservations)) {
        reservationsArray = data.reservations;
        console.log("📦 Извлечен массив из data.reservations");
      }
      // Формат 4: { success: true, data: [...] }
      else if (data.success && Array.isArray(data.data)) {
        reservationsArray = data.data;
        console.log("📦 Извлечен массив из data.data (с оберткой success)");
      }
      // Формат 5: Один объект бронирования
      else if (data.id) {
        reservationsArray = [data];
        console.log("📦 Преобразовали одиночный объект в массив");
      }
    }

    if (!Array.isArray(reservationsArray) || reservationsArray.length === 0) {
      console.warn("⚠️ Нет данных для обработки:", data);
      return [];
    }

    console.log(`✅ Будут обработаны ${reservationsArray.length} бронирований`);

    return reservationsArray.map((reservation: any) => {
      console.log("📝 Обработка брони:", {
        id: reservation.id,
        user: reservation.user,
        table: reservation.table,
      });

      // Извлекаем данные в нужном формате
      const user = reservation.user || {};
      const table = reservation.table || {};
      const restaurant =
        reservation.restaurant ||
        table.restaurant ||
        reservation.table?.restaurant ||
        {};

      return {
        id: reservation.id?.toString() || `temp_${Date.now()}_${Math.random()}`,
        user_id: reservation.user_id || user.id || 0,
        user_name: user.name || reservation.user_name || "Неизвестный клиент",
        user_email: user.email || reservation.user_email || "Нет email",
        user_phone:
          user.phone ||
          reservation.user_phone ||
          reservation.phone ||
          "Нет телефона",
        restaurant_id:
          reservation.restaurant_id ||
          table.restaurant_id ||
          restaurant.id ||
          0,
        restaurant_name: restaurant.name || "Ресторан",
        table_id: reservation.table_id || table.id || 0,
        table_number: table.number || table.table_number || 0,
        date_time:
          reservation.date_time ||
          reservation.datetime ||
          reservation.reservation_time ||
          "",
        duration: reservation.duration || 2,
        guests_count:
          reservation.guests_count ||
          reservation.guests ||
          reservation.number_of_guests ||
          reservation.persons ||
          1,
        price: reservation.price || 0,
        status: reservation.status || "pending",
        special_requests:
          reservation.special_requests ||
          reservation.notes ||
          reservation.comments ||
          reservation.request ||
          "",
        created_at: reservation.created_at || new Date().toISOString(),
        updated_at: reservation.updated_at || new Date().toISOString(),
      };
    });
  }

  private getErrorMessage(error: any): string {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return "Требуется авторизация";
        case 403:
          return "Доступ запрещен. У вас нет прав администратора";
        case 404:
          return "Endpoint не найден. Проверьте URL API";
        case 500:
          return "Ошибка сервера. Попробуйте позже";
        default:
          return (
            error.response.data?.message ||
            `Ошибка ${error.response.status}: ${error.response.statusText}`
          );
      }
    } else if (error.request) {
      return "Нет ответа от сервера. Проверьте подключение";
    } else {
      return error.message || "Неизвестная ошибка";
    }
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    try {
      console.log(
        `🔄 Обновление статуса брони #${applicationId} на "${status}"`
      );

      const response = await api.put(`/admin/reservations/${applicationId}`, {
        status,
      });

      console.log(`✅ Статус обновлен:`, response.data);

      runInAction(() => {
        const index = this.applications.findIndex(
          (app) => app.id === applicationId
        );
        if (index !== -1) {
          this.applications[index].status = status;
          this.applications[index].updated_at = new Date().toISOString();
        }
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("❌ Ошибка обновления статуса:", error);

      runInAction(() => {
        this.error = this.getErrorMessage(error);
      });

      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async deleteApplication(applicationId: string) {
    try {
      console.log(`🗑️ Удаление брони #${applicationId}`);

      if (!confirm("Вы уверены, что хотите удалить эту заявку?")) {
        return { success: false, error: "Отменено пользователем" };
      }

      await api.delete(`/admin/reservations/${applicationId}`);

      console.log(`✅ Бронь #${applicationId} удалена`);

      runInAction(() => {
        this.applications = this.applications.filter(
          (app) => app.id !== applicationId
        );
      });

      return { success: true };
    } catch (error: any) {
      console.error("❌ Ошибка удаления:", error);

      runInAction(() => {
        this.error = this.getErrorMessage(error);
      });

      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async reloadApplications() {
    console.log("🔄 Принудительная перезагрузка бронирований");
    await this.loadApplications();
  }

  getApplicationById(id: string): Application | undefined {
    return this.applications.find((app) => app.id === id);
  }

  getApplicationsByStatus(status: string): Application[] {
    return this.applications.filter((app) => app.status === status);
  }

  getStatistics() {
    const total = this.applications.length;
    const pending = this.applications.filter(
      (app) => app.status === "pending"
    ).length;
    const confirmed = this.applications.filter(
      (app) => app.status === "confirmed"
    ).length;
    const cancelled = this.applications.filter(
      (app) => app.status === "cancelled"
    ).length;
    const completed = this.applications.filter(
      (app) => app.status === "completed"
    ).length;

    const revenue = this.applications
      .filter((app) => ["confirmed", "completed"].includes(app.status))
      .reduce((sum, app) => sum + (app.price || 0), 0);

    return {
      total,
      pending,
      confirmed,
      cancelled,
      completed,
      revenue,
      lastUpdated: this.lastLoaded,
    };
  }

  clearError() {
    this.error = null;
  }

  // Для отладки
  getRawApplications() {
    return this.applications;
  }

  // Очистка хранилища
  clear() {
    this.applications = [];
    this.error = null;
    this.lastLoaded = null;
  }
}

export const applicationsStore = new ApplicationsStore();
