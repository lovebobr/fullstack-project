import { makeAutoObservable, runInAction } from "mobx";
import type { Restaurant, Table } from "../../interfaces/restaurant.interfaces";
import { RestaurantService, TableService } from "../../api/api.service";
import { api } from "../../shared/lib/axios";

class RestaurantStore {
  restaurants: Restaurant[] = [];
  currentRestaurant: Restaurant | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadRestaurants(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const restaurants = await RestaurantService.getAll();
      runInAction(() => {
        this.restaurants = restaurants;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка загрузки";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async loadRestaurant(id: number): Promise<void> {
    this.loading = true;

    try {
      const restaurant = await RestaurantService.getById(id);
      runInAction(() => {
        this.currentRestaurant = restaurant;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка загрузки";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async createRestaurant(
    restaurantData: Omit<Restaurant, "id" | "tables">
  ): Promise<void> {
    try {
      const newRestaurant = await RestaurantService.create(restaurantData);
      runInAction(() => {
        this.restaurants.push(newRestaurant);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка создания";
      });
      throw error;
    }
  }

  async createTable(
    restaurantId: number,
    tableData: Omit<Table, "id" | "restaurant_id">
  ): Promise<Table> {
    this.loading = true;
    this.error = null;

    try {
      console.log("Создаем стол в БД:", { restaurantId, tableData });
      const newTable = await TableService.create(restaurantId, tableData);
      console.log("Стол создан успешно:", newTable);

      runInAction(() => {
        const restaurant = this.restaurants.find((r) => r.id === restaurantId);
        if (restaurant) {
          restaurant.tables.push(newTable);
        }
        if (this.currentRestaurant?.id === restaurantId) {
          this.currentRestaurant.tables.push(newTable);
        }
      });

      return newTable; // Возвращаем созданный стол с ID
    } catch (error: any) {
      console.error("Ошибка создания стола в store:", error);
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка создания столика";
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateRestaurant(
    id: number,
    restaurantData: Partial<Restaurant>
  ): Promise<void> {
    try {
      const updatedRestaurant = await RestaurantService.update(
        id,
        restaurantData
      );
      runInAction(() => {
        this.restaurants = this.restaurants.map((r) =>
          r.id === id ? { ...r, ...updatedRestaurant } : r
        );
        if (this.currentRestaurant?.id === id) {
          this.currentRestaurant = {
            ...this.currentRestaurant,
            ...updatedRestaurant,
          };
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка обновления";
      });
      throw error;
    }
  }

  async saveRestaurantLayout(
    restaurantId: number,
    layoutData: any
  ): Promise<void> {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const response = await api.put(`/admin/restaurants/${restaurantId}`, {
        layout_data: layoutData,
      });

      runInAction(() => {
        const restaurant = this.restaurants.find((r) => r.id === restaurantId);
        if (restaurant) {
          restaurant.layout_data = layoutData;
        }
        if (this.currentRestaurant?.id === restaurantId) {
          this.currentRestaurant.layout_data = layoutData;
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка сохранения плана";
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteRestaurant(id: number): Promise<void> {
    try {
      await RestaurantService.delete(id);
      runInAction(() => {
        this.restaurants = this.restaurants.filter((r) => r.id !== id);
        if (this.currentRestaurant?.id === id) {
          this.currentRestaurant = null;
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка удаления";
      });
      throw error;
    }
  }

  async deleteTable(tableId: number): Promise<void> {
    try {
      await TableService.delete(tableId);
      runInAction(() => {
        this.restaurants.forEach((restaurant) => {
          restaurant.tables = restaurant.tables.filter(
            (t: Table) => t.id !== tableId
          );
        });
        if (this.currentRestaurant) {
          this.currentRestaurant.tables = this.currentRestaurant.tables.filter(
            (t: Table) => t.id !== tableId
          );
        }
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || "Ошибка удаления столика";
      });
      throw error;
    }
  }
}

export const restaurantStore = new RestaurantStore();
