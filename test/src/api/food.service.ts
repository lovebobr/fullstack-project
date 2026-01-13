// src/services/foodService.ts
import { api } from "../shared/lib/axios";

export interface FoodItem {
  id: number;
  name: string;
  image_url: string;
  calories: number;
  ingredients: string;
  price: number;
}

export const foodService = {
  // Просто получаем все блюда
  async getFoods(): Promise<FoodItem[]> {
    const response = await api.get<FoodItem[]>("/foods");
    return response.data;
  },

  // Получить блюдо по ID
  async getFoodById(id: number): Promise<FoodItem> {
    const response = await api.get<FoodItem>(`/foods/${id}`);
    return response.data;
  },
};
