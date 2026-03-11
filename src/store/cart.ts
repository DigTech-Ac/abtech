import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
  specs?: Record<string, string>;
  isDigital?: boolean; 
  fileUrl?: string;   
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find(item => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
      },

      updateQuantity: (productId: string, delta: number) => {
        const item = get().items.find(i => i.product.id === productId);
        if (!item) return;
        
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      },

      getCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      }
    }),
    {
      name: 'abtech-cart'
    }
  )
);
