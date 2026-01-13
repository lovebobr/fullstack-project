// api/reservation.service.ts
import { api } from "../shared/lib/axios";

export interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  date_time: string;
  duration: number; // ДОБАВЛЯЕМ
  end_time: string; // ДОБАВЛЯЕМ
  status: "confirmed" | "pending" | "cancelled";
  guests_count: number;
  user_name: string;
  user_phone: string;
  special_requests?: string;
  price: number; // ДОБАВЛЯЕМ
  restaurant_id?: number;
  restaurant?: {
    id: number;
    name: string;
    address: string;
    description?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  table?: {
    id: number;
    number: number;
    seats: number;
    restaurant_id: number;
  };
}

export interface CreateReservationData {
  table_id: number;
  date_time: string;
  user_name: string;
  user_phone: string;
  guests_count: number;
  special_requests?: string;
  duration?: number; // ДОБАВЛЯЕМ
  price?: number; // ДОБАВЛЯЕМ
}

export const ReservationService = {
  async create(reservationData: CreateReservationData): Promise<Reservation> {
    const { data } = await api.post<Reservation>("/reservations", {
      ...reservationData,
      duration: reservationData.duration || 2, // По умолчанию 2 часа
      price: reservationData.price || 100, // Минимальный депозит
    });
    return data;
  },

  async getById(reservationId: number): Promise<Reservation> {
    const { data } = await api.get<Reservation>(
      `/reservations/${reservationId}`
    );
    return data;
  },

  async getByRestaurant(
    restaurantId: number,
    date: string
  ): Promise<Reservation[]> {
    try {
      const { data } = await api.get<Reservation[]>("/reservations", {
        params: {
          restaurant_id: restaurantId,
          date: date,
        },
      });
      return data;
    } catch (error) {
      console.error("Ошибка загрузки бронирований:", error);
      return [];
    }
  },

  // НОВЫЙ МЕТОД: Обновить статус бронирования (после оплаты)
  async confirm(reservationId: number): Promise<Reservation> {
    const { data } = await api.put<Reservation>(
      `/reservations/${reservationId}`,
      { status: "confirmed" }
    );
    return data;
  },

  async checkAvailability(
    tableId: number,
    dateTime: string,
    duration: number = 2
  ): Promise<{ available: boolean; existing_reservation?: Reservation }> {
    const { data } = await api.post("/reservations/check-availability", {
      table_id: tableId,
      date_time: dateTime,
      duration: duration,
    });
    return data;
  },

  async cancel(reservationId: number): Promise<void> {
    await api.delete(`/reservations/${reservationId}`);
  },
};
