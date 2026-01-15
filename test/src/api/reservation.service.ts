// api/reservation.service.ts
import { api } from "../shared/lib/axios";
import dayjs from "dayjs";

export interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  date_time: string;
  duration: number;
  end_time: string;
  status: "confirmed" | "pending" | "cancelled";
  guests_count: number;
  user_name: string;
  user_phone: string;
  special_requests?: string;
  price: number;
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
  duration?: number;
  price?: number;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  existing_reservation?: Reservation;
  message?: string;
}

export const ReservationService = {
  async create(reservationData: CreateReservationData): Promise<Reservation> {
    const { data } = await api.post<Reservation>("/reservations", {
      ...reservationData,
      duration: reservationData.duration || 2,
      price: reservationData.price || 100,
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

  async getAllReservationsForTable(tableId: number): Promise<Reservation[]> {
    try {
      const { data } = await api.get<Reservation[]>("/reservations", {
        params: { table_id: tableId },
      });
      return data;
    } catch (error) {
      console.error("Ошибка получения бронирований стола:", error);
      return [];
    }
  },

  async checkAvailability(
    tableId: number,
    dateTime: string,
    duration: number = 2
  ): Promise<CheckAvailabilityResponse> {
    try {
      // Пробуем использовать менеджерский маршрут
      const { data } = await api.post(
        "/manager/reservations/check-availability",
        {
          table_id: tableId,
          date_time: dateTime,
          duration: duration,
        }
      );
      return data;
    } catch (error: any) {
      console.error(
        "Ошибка проверки доступности (менеджерский маршрут):",
        error
      );

      // Если ошибка доступа, пробуем публичную проверку
      if (error.response?.status === 403 || error.response?.status === 401) {
        return await this.publicCheckAvailability(tableId, dateTime, duration);
      }

      // Если метод не поддерживается, пробуем GET
      if (error.response?.status === 405) {
        try {
          const { data } = await api.get(
            "/manager/reservations/check-availability",
            {
              params: {
                table_id: tableId,
                date_time: dateTime,
                duration: duration,
              },
            }
          );
          return data;
        } catch (getError) {
          console.error("GET также не работает:", getError);
          return await this.publicCheckAvailability(
            tableId,
            dateTime,
            duration
          );
        }
      }

      // Для других ошибок используем публичную проверку
      return await this.publicCheckAvailability(tableId, dateTime, duration);
    }
  },

  async publicCheckAvailability(
    tableId: number,
    dateTime: string,
    duration: number = 2
  ): Promise<CheckAvailabilityResponse> {
    try {
      // Получаем все брони для этого стола
      const allReservations = await this.getAllReservationsForTable(tableId);

      const startTime = dayjs(dateTime);
      const endTime = startTime.add(duration, "hour");

      // Ищем конфликтующие confirmed брони
      const conflictingReservation = allReservations.find((reservation) => {
        if (reservation.status !== "confirmed") return false;

        const resStart = dayjs(reservation.date_time);
        const resDuration = reservation.duration || 2;
        const resEnd = reservation.end_time
          ? dayjs(reservation.end_time)
          : resStart.add(resDuration, "hour");

        // Проверка пересечения интервалов:
        // 1. Новая бронь начинается во время существующей
        // 2. Новая бронь заканчивается во время существующей
        // 3. Новая бронь полностью содержит существующую
        // 4. Существующая бронь полностью содержит новую

        return (
          (startTime.isBefore(resEnd) && endTime.isAfter(resStart)) ||
          startTime.isSame(resStart) ||
          endTime.isSame(resEnd)
        );
      });

      if (conflictingReservation) {
        const resStart = dayjs(conflictingReservation.date_time);
        const resDuration = conflictingReservation.duration || 2;
        const resEnd = conflictingReservation.end_time
          ? dayjs(conflictingReservation.end_time)
          : resStart.add(resDuration, "hour");

        const remainingMinutes = resEnd.diff(startTime, "minute");
        const hours = Math.floor(remainingMinutes / 60);
        const minutes = remainingMinutes % 60;

        let remainingTime = "";
        if (hours > 0) remainingTime += `${hours} ч `;
        if (minutes > 0) remainingTime += `${minutes} мин`;

        return {
          available: false,
          existing_reservation: conflictingReservation,
          message: `Стол занят. Занят еще: ${remainingTime || "0 мин"}`,
        };
      }

      return {
        available: true,
      };
    } catch (error) {
      console.error("Ошибка публичной проверки:", error);

      // В случае ошибки считаем стол доступным,
      // но предупреждаем пользователя о возможной проблеме
      return {
        available: true,
        message:
          "Проверка доступности временно недоступна. Пожалуйста, проверьте вручную.",
      };
    }
  },

  async confirm(reservationId: number): Promise<Reservation> {
    try {
      const { data } = await api.put<Reservation>(
        `/manager/reservations/${reservationId}`,
        { status: "confirmed" }
      );
      return data;
    } catch (error: any) {
      // Если нет прав менеджера, пробуем через админский маршрут
      if (error.response?.status === 403) {
        try {
          const { data } = await api.put<Reservation>(
            `/admin/reservations/${reservationId}`,
            { status: "confirmed" }
          );
          return data;
        } catch (adminError) {
          console.error(
            "Ошибка подтверждения (админский маршрут):",
            adminError
          );
          throw adminError;
        }
      }
      console.error("Ошибка подтверждения бронирования:", error);
      throw error;
    }
  },

  async cancel(reservationId: number): Promise<void> {
    await api.delete(`/reservations/${reservationId}`);
  },

  async update(
    reservationId: number,
    updates: Partial<Reservation>
  ): Promise<Reservation> {
    try {
      const { data } = await api.put<Reservation>(
        `/manager/reservations/${reservationId}`,
        updates
      );
      return data;
    } catch (error: any) {
      // Если нет прав менеджера, пробуем через админский маршрут
      if (error.response?.status === 403) {
        try {
          const { data } = await api.put<Reservation>(
            `/admin/reservations/${reservationId}`,
            updates
          );
          return data;
        } catch (adminError) {
          console.error("Ошибка обновления (админский маршрут):", adminError);
          throw adminError;
        }
      }
      console.error("Ошибка обновления бронирования:", error);
      throw error;
    }
  },

  // Дополнительный метод для проверки, доступен ли стол прямо сейчас
  async isTableAvailableNow(tableId: number): Promise<boolean> {
    try {
      const allReservations = await this.getAllReservationsForTable(tableId);
      const now = dayjs();

      const activeReservation = allReservations.find((reservation) => {
        if (reservation.status !== "confirmed") return false;

        const startTime = dayjs(reservation.date_time);
        const duration = reservation.duration || 2;
        const endTime = reservation.end_time
          ? dayjs(reservation.end_time)
          : startTime.add(duration, "hour");

        return now.isAfter(startTime) && now.isBefore(endTime);
      });

      return !activeReservation;
    } catch (error) {
      console.error("Ошибка проверки доступности сейчас:", error);
      return true;
    }
  },

  // Метод для получения ближайших бронирований стола
  async getUpcomingReservations(
    tableId: number,
    limit: number = 5
  ): Promise<Reservation[]> {
    try {
      const allReservations = await this.getAllReservationsForTable(tableId);
      const now = dayjs();

      return allReservations
        .filter((reservation) => reservation.status === "confirmed")
        .filter((reservation) => {
          const startTime = dayjs(reservation.date_time);
          return startTime.isAfter(now);
        })
        .sort((a, b) => dayjs(a.date_time).diff(dayjs(b.date_time)))
        .slice(0, limit);
    } catch (error) {
      console.error("Ошибка получения ближайших бронирований:", error);
      return [];
    }
  },
};
