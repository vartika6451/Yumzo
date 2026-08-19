import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      toastMessage: null,

      // Actions
      showToast: (msg) => {
        set({ toastMessage: msg });
        setTimeout(() => set({ toastMessage: null }), 2000);
      },

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => (item.id && item.id === newItem.id) || item.name === newItem.name
          );

          if (existingItemIndex >= 0) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            get().showToast('Added to Cart!');
            return { items: updatedItems };
          }

          // Item does not exist, add it
          get().showToast('Added to Cart!');
          return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }] };
        });
      },

      removeItem: (identifier) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== identifier && item.name !== identifier
          ),
        }));
      },

      updateQuantity: (identifier, amount) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === identifier || item.name === identifier) {
              return { ...item, quantity: Math.max(1, item.quantity + amount) };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'yumzo-cart-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useCartStore;
