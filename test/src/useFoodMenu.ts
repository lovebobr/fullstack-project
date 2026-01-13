// src/hooks/useFoodMenu.ts
import { useState, useEffect } from "react";
import { foodService } from "./api/food.service";
import type { FoodItem } from "./api/food.service";

export const useFoodMenu = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const foodsData = await foodService.getFoods();
      setFoods(foodsData);
    } catch (err) {
      setError("Не удалось загрузить меню");
      console.error("Error loading food data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    foods,
    loading,
    error,
    reload: loadData,
  };
};
