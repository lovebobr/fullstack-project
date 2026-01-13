export interface Table {
  id: number;
  restaurant_id: number;
  number: number;
  seats: number;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  description: string;
  layout_data?: RestaurantLayout;
  tables: Table[];
  created_at: string;
  updated_at: string;
}

export interface RestaurantLayout {
  version: string;
  tables: LayoutTableItem[];
  walls: LayoutWallItem[];
  windows: LayoutWindowItem[];
  metadata: LayoutMetadata;
}

export interface LayoutTableItem {
  id: string;
  type: "table";
  tableType:
    | "table-1"
    | "table-2"
    | "table-4-1"
    | "table-4-2"
    | "table-4-3"
    | "table-4-4";
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  tableNumber: number;
  tableId: number;
  seats: number;
  isBooked?: boolean;
}

export interface LayoutWallItem {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  color: string;
}

export interface LayoutWindowItem {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  stroke: string;
  strokeWidth: number;
}

export interface LayoutMetadata {
  canvasSize: { width: number; height: number };
  lastModified: string;
}
