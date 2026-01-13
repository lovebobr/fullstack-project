import { api } from "../shared/lib/axios";
import type { Restaurant, Table } from "../interfaces/restaurant.interfaces";

export const RestaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const { data } = await api.get<Restaurant[]>("/restaurants");
    return data;
  },

  async getById(id: number): Promise<Restaurant> {
    const { data } = await api.get<Restaurant>(`/restaurants/${id}`);
    return data;
  },

  async create(
    restaurant: Omit<Restaurant, "id" | "tables">
  ): Promise<Restaurant> {
    const { data } = await api.post<Restaurant>(
      "/admin/restaurants",
      restaurant
    );
    return data;
  },

  async update(
    id: number,
    restaurant: Partial<Restaurant>
  ): Promise<Restaurant> {
    const { data } = await api.put<Restaurant>(
      `/admin/restaurants/${id}`,
      restaurant
    );
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/admin/restaurants/${id}`);
  },
};

export const TableService = {
  async getByRestaurant(restaurantId: number): Promise<Table[]> {
    const { data } = await api.get<Table[]>(
      `/restaurants/${restaurantId}/tables`
    );
    return data;
  },

  async create(
    restaurantId: number,
    table: Omit<Table, "id" | "restaurant_id">
  ): Promise<Table> {
    const { data } = await api.post<Table>(
      `/manager/restaurants/${restaurantId}/tables`,
      table
    );
    return data;
  },

  async update(id: number, table: Partial<Table>): Promise<Table> {
    const { data } = await api.put<Table>(`/manager/tables/${id}`, table);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/manager/tables/${id}`);
  },
};
