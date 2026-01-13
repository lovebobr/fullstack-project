// tables.ts
export type TableTemplate = {
  id: string;
  name: string;
  imageUrl: string;
  bookedImageUrl: string;
  width: number;
  height: number;
  seats: number;
  maxSeats: number;
  type: string;
};

export type WallTemplate = {
  id: string;
  name: string;
  width: number;
  height: number;
};

export const TABLE_TEMPLATES: TableTemplate[] = [
  {
    id: "table-1",
    name: "Стол на 1 персону",
    imageUrl: "/image/table-1-free.png",
    bookedImageUrl: "/image/table-1-booked.png",
    width: 70,
    height: 48,
    seats: 1,
    maxSeats: 1,
    type: "table-1" as const,
  },
  {
    id: "table-2",
    name: "Стол на 2 персоны",
    imageUrl: "/image/table-2-free.png",
    bookedImageUrl: "/image/table-2-booked.png",
    width: 100,
    height: 90,
    seats: 2,
    maxSeats: 2,
    type: "table-2" as const,
  },
  {
    id: "table-4-1",
    name: "Стол на 4 персоны (вариант 1)",
    imageUrl: "/image/table-4-1-free.png",
    bookedImageUrl: "/image/table-4-1-booked.png",
    width: 90,
    height: 77,
    seats: 4,
    maxSeats: 4,
    type: "table-4-1" as const,
  },
  {
    id: "table-4-2",
    name: "Стол на 4 персоны (вариант 2)",
    imageUrl: "/image/table-4-2-free.png",
    bookedImageUrl: "/image/table-4-2-booked.png",
    width: 110,
    height: 80,
    seats: 4,
    maxSeats: 4,
    type: "table-4-2" as const,
  },
  {
    id: "table-4-3",
    name: "Стол на 4 персоны (вариант 3)",
    imageUrl: "/image/table-4-3-free.png",
    bookedImageUrl: "/image/table-4-3-booked.png",
    width: 102,
    height: 89,
    seats: 4,
    maxSeats: 4,
    type: "table-4-3" as const,
  },
  {
    id: "table-4-4",
    name: "Стол на 4 персоны (вариант 4)",
    imageUrl: "/image/table-4-4-free.png",
    bookedImageUrl: "/image/table-4-4-booked.png",
    width: 78,
    height: 80,
    seats: 4,
    maxSeats: 4,
    type: "table-4-4" as const,
  },
] as const;

// Добавляем шаблоны для стен
export const WALL_TEMPLATES: WallTemplate[] = [
  { id: "short", name: "Короткая стена", width: 100, height: 20 },
  { id: "long", name: "Длинная стена", width: 600, height: 20 },
];

// Цвета для редактора
export const EDITOR_COLORS = {
  background: "#1a1a1a",
  wall: "#141414",
  window: "#666666",
  strokeSelected: "#007bff",
  strokeBooked: "#dc3545",
} as const;

// Размеры канваса
export const CANVAS_SIZE = {
  width: 900,
  height: 700,
} as const;

export const ROTATION_SNAPS = [0, 45, 90, 135, 180, 225, 270, 315] as const;
