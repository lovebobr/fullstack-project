import { makeAutoObservable } from "mobx";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export class CartStore {
  items: CartItem[] = [];
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item: Omit<CartItem, "quantity">, quantity: number = 1) {
    const existingItem = this.items.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...item,
        quantity,
      });
    }
  }

  removeItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
      }
    }
  }

  decreaseQuantity(id: number) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeItem(id);
      }
    }
  }

  increaseQuantity(id: number) {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.quantity += 1;
    }
  }

  clearCart() {
    this.items = [];
  }

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
  }

  openCart() {
    this.isOpen = true;
  }

  closeCart() {
    this.isOpen = false;
  }
}

export const cartStore = new CartStore();
