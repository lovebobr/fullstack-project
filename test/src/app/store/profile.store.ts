import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../../shared/lib/axios";

// Интерфейс для элемента истории бронирований
export interface ReservationHistoryItem {
  id: number;
  restaurantName: string;
  tableNumber: string;
  tableSeats: number;
  date_time: string;
  status: string;
  guests_count?: number;
  totalAmount?: number;
}

// Обновленный интерфейс ProfileData с историей бронирований
export interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at?: string;
  reservations?: ReservationHistoryItem[]; // Изменено с orders на reservations
}

export class ProfileStore {
  profileData: ProfileData | null = null;
  loading = false;
  error: string | null = null;
  updating = false;
  loadingReservations = false; // Изменено с loadingOrders

  constructor() {
    makeAutoObservable(this);
  }

  async loadProfile() {
    this.loading = true;
    this.error = null;

    try {
      // Загружаем профиль пользователя
      const profileResponse = await api.get("/user");

      // Загружаем историю бронирований для всех пользователей
      let reservations: ReservationHistoryItem[] = [];
      try {
        const reservationsResponse = await api.get("/reservations");
        reservations =
          reservationsResponse.data.data?.map((reservation: any) => ({
            id: reservation.id,
            restaurantName: reservation.table?.restaurant?.name || "Ресторан",
            tableNumber: reservation.table?.number || "Н/Д",
            tableSeats: reservation.table?.seats || 0,
            date_time: reservation.date_time,
            status: reservation.status,
            guests_count: reservation.guests_count,
            // Можно добавить totalAmount если есть платежи
          })) || [];
      } catch (reservationError) {
        console.warn(
          "Не удалось загрузить историю бронирований:",
          reservationError
        );
        // Если не удалось загрузить бронирования, продолжаем без них
      }

      runInAction(() => {
        this.profileData = {
          ...profileResponse.data,
          reservations,
        };
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка загрузки профиля";
        this.loading = false;
      });
      throw error;
    }
  }

  // Метод для загрузки только истории бронирований
  async loadReservationHistory() {
    this.loadingReservations = true;

    try {
      const response = await api.get("/reservations");
      const reservations =
        response.data.data?.map((reservation: any) => ({
          id: reservation.id,
          restaurantName: reservation.table?.restaurant?.name || "Ресторан",
          tableNumber: reservation.table?.number || "Н/Д",
          tableSeats: reservation.table?.seats || 0,
          date_time: reservation.date_time,
          status: reservation.status,
          guests_count: reservation.guests_count,
        })) || [];

      runInAction(() => {
        if (this.profileData) {
          this.profileData.reservations = reservations;
        }
        this.loadingReservations = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error =
          error.response?.data?.message ||
          "Ошибка загрузки истории бронирований";
        this.loadingReservations = false;
      });
    }
  }

  async updateProfileField(field: string, value: string) {
    this.updating = true;
    this.error = null;

    try {
      const updateData = { [field]: value };
      const response = await api.put("/user", updateData);

      runInAction(() => {
        // Сохраняем существующую историю бронирований при обновлении профиля
        this.profileData = {
          ...response.data,
          reservations: this.profileData?.reservations || [],
        };
        this.updating = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error =
          error.response?.data?.message || "Ошибка обновления профиля";
        this.updating = false;
      });
      throw error;
    }
  }

  clearError() {
    this.error = null;
  }

  reset() {
    this.profileData = null;
    this.loading = false;
    this.error = null;
    this.updating = false;
    this.loadingReservations = false;
  }
}

export const profileStore = new ProfileStore();
