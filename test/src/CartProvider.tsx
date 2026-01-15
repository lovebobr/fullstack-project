import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// Типы данных
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  food_id?: number;
}

// Тип контекста
interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartForApi: () => Array<{ food_id: number; quantity: number }>;
}

// Создаем контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Провайдер контекста
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      setItems((prev) => {
        const existingItemIndex = prev.findIndex((i) => i.id === item.id);

        if (existingItemIndex >= 0) {
          const updatedItems = [...prev];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          return updatedItems;
        } else {
          return [...prev, { ...item, quantity }];
        }
      });
    },
    []
  );

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }

      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const increaseQuantity = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.quantity <= 1) {
            return item; // Не удаляем, оставляем 1
          }
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const getCartForApi = useCallback(() => {
    return items.map((item) => ({
      food_id: item.food_id || item.id,
      quantity: item.quantity,
    }));
  }, [items]);

  const value: CartContextType = {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getCartForApi,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Экспортируем хук для использования контекста
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Экспортируем контекст для возможного прямого использования (опционально)
export { CartContext };
