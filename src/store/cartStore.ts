import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IProductBase } from "../types";

export interface CartVariant {
  id: string;
  name: string;
}

export interface CartItem extends IProductBase {
  cartItemId: string;
  quantity: number;
  variant?: CartVariant;
}

interface CartState {
  items: CartItem[];

  addItem: (
    product: IProductBase,
    quantity: number,
    variant?: CartVariant
  ) => void;

  removeItem: (cartItemId: string) => void;

  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  getTotalItems: () => number;

  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, variant) => {
        const items = get().items;

        const cartItemId = `${product.id}_${variant?.id || "default"}`;

        const existingItem = items.find(
          (item) => item.cartItemId === cartItemId
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.cartItemId === cartItemId
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                  }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                cartItemId,
                quantity,
                variant,
              },
            ],
          });
        }
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter(
            (item) => item.cartItemId !== cartItemId
          ),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;

        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity,
                }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "miss-candle-cart",
    }
  )
);