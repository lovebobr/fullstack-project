import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../../shared/lib/axios";

export interface ReservationHistoryItem {
  id: number;
  restaurantName: string;
  tableNumber: string;
  tableSeats: number;
  date_time: string;
  status: string;
  guests_count?: number;
  duration?: number;
  price?: string;
  special_requests?: string;
  user_id?: number;
  user_name?: string;
  user_phone?: string;
  created_at?: string;
  updated_at?: string;
  end_time?: string;
  restaurant_id?: number;
  table_id?: number;
}

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at?: string;
  reservations?: ReservationHistoryItem[];
}

export class ProfileStore {
  profileData: ProfileData | null = null;
  loading = false;
  error: string | null = null;
  updating = false;
  loadingReservations = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadProfile() {
    this.loading = true;
    this.error = null;

    try {
      console.log("=== Начало загрузки профиля ===");
      
      // 1. Загружаем профиль текущего пользователя
      const profileResponse = await api.get("/user");
      const currentUser = profileResponse.data;
      console.log("Текущий пользователь:", {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      });

      // 2. Загружаем бронирования текущего пользователя
      let reservations: ReservationHistoryItem[] = [];
      try {
        console.log("Запрос бронирований по эндпоинту /reservations");
        const reservationsResponse = await api.get("/reservations");
        console.log("Ответ от API (/reservations):", reservationsResponse.data);

        // API теперь возвращает бронирования только текущего пользователя
        if (Array.isArray(reservationsResponse.data)) {
          reservations = reservationsResponse.data.map((reservation: any) => ({
            id: reservation.id,
            restaurantName: reservation.table?.restaurant?.name || 
                           reservation.table?.restaurant_name || 
                           "Ресторан",
            tableNumber: reservation.table?.number || 
                        reservation.table?.table_number || 
                        reservation.table_id?.toString() || 
                        "Н/Д",
            tableSeats: reservation.table?.seats || 
                       reservation.table?.table_seats || 
                       0,
            date_time: reservation.date_time,
            status: reservation.status,
            guests_count: reservation.guests_count,
            duration: reservation.duration,
            price: reservation.price,
            special_requests: reservation.special_requests,
            user_id: reservation.user_id,
            user_name: reservation.user_name,
            user_phone: reservation.user_phone,
            created_at: reservation.created_at,
            updated_at: reservation.updated_at,
            end_time: reservation.end_time,
            restaurant_id: reservation.table?.restaurant_id || 
                          reservation.table?.restaurant?.id,
            table_id: reservation.table_id || reservation.table?.id,
          }));
        } else if (reservationsResponse.data.data && Array.isArray(reservationsResponse.data.data)) {
          // Если данные в поле data
          reservations = reservationsResponse.data.data.map((reservation: any) => ({
            id: reservation.id,
            restaurantName: reservation.table?.restaurant?.name || 
                           reservation.table?.restaurant_name || 
                           "Ресторан",
            tableNumber: reservation.table?.number || 
                        reservation.table?.table_number || 
                        reservation.table_id?.toString() || 
                        "Н/Д",
            tableSeats: reservation.table?.seats || 
                       reservation.table?.table_seats || 
                       0,
            date_time: reservation.date_time,
            status: reservation.status,
            guests_count: reservation.guests_count,
            duration: reservation.duration,
            price: reservation.price,
            special_requests: reservation.special_requests,
            user_id: reservation.user_id,
            user_name: reservation.user_name,
            user_phone: reservation.user_phone,
            created_at: reservation.created_at,
            updated_at: reservation.updated_at,
            end_time: reservation.end_time,
            restaurant_id: reservation.table?.restaurant_id || 
                          reservation.table?.restaurant?.id,
            table_id: reservation.table_id || reservation.table?.id,
          }));
        }
        
        console.log(`Обработано бронирований: ${reservations.length}`);
        
        // Проверяем user_id в каждом бронировании
        reservations.forEach((res, index) => {
          console.log(`Бронирование ${index + 1}:`, {
            id: res.id,
            user_id: res.user_id,
            tableNumber: res.tableNumber,
            status: res.status,
            restaurant: res.restaurantName
          });
        });
        
      } catch (reservationError: any) {
        console.error("Ошибка загрузки бронирований:", {
          message: reservationError.message,
          response: reservationError.response?.data,
          status: reservationError.response?.status
        });
        
        // Пробуем альтернативный эндпоинт, если есть
        try {
          console.log("Пробуем эндпоинт /my-reservations");
          const myReservationsResponse = await api.get("/my-reservations");
          console.log("Ответ от /my-reservations:", myReservationsResponse.data);
          
          if (Array.isArray(myReservationsResponse.data)) {
            reservations = myReservationsResponse.data.map((reservation: any) => ({
              id: reservation.id,
              restaurantName: reservation.table?.restaurant?.name || "Ресторан",
              tableNumber: reservation.table?.number || reservation.table_id?.toString() || "Н/Д",
              tableSeats: reservation.table?.seats || 0,
              date_time: reservation.date_time,
              status: reservation.status,
              guests_count: reservation.guests_count,
              duration: reservation.duration,
              price: reservation.price,
              special_requests: reservation.special_requests,
              user_id: reservation.user_id,
              user_name: reservation.user_name,
              user_phone: reservation.user_phone,
              created_at: reservation.created_at,
              updated_at: reservation.updated_at,
              end_time: reservation.end_time,
              restaurant_id: reservation.table?.restaurant_id,
              table_id: reservation.table_id,
            }));
          }
        } catch (error) {
          console.warn("Не удалось загрузить историю бронирований:", error);
        }
      }

      runInAction(() => {
        this.profileData = {
          ...currentUser,
          reservations,
        };
        this.loading = false;
        console.log("Профиль успешно загружен:", {
          userId: currentUser.id,
          reservationsCount: reservations.length
        });
      });
    } catch (error: any) {
      console.error("Критическая ошибка загрузки профиля:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
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
      console.log("Обновление списка бронирований...");
      
      // Обновляем весь профиль
      await this.loadProfile();
      
      console.log("Список бронирований обновлен");
    } catch (error: any) {
      console.error("Ошибка обновления бронирований:", error);
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
      console.log(`Обновление поля ${field}: ${value}`);
      
      const updateData = { [field]: value };
      const response = await api.put("/user", updateData);

      runInAction(() => {
        // Сохраняем существующую историю бронирований при обновлении профиля
        if (this.profileData) {
          this.profileData = {
            ...response.data,
            reservations: this.profileData.reservations || [],
          };
        }
        this.updating = false;
        console.log(`Поле ${field} успешно обновлено`);
      });
    } catch (error: any) {
      console.error(`Ошибка обновления поля ${field}:`, error);
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