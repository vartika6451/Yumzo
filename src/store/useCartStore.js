import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      toastMessage: null,

      // Toast Notifications
      showToast: (msg) => {
        set({ toastMessage: msg });
        setTimeout(() => set({ toastMessage: null }), 2500);
      },

      // Drawer Controls
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (open) => set({ isCartOpen: open }),

      /**
       * Add food item to cart
       * Identifies items strictly by Supabase item.id (UUID).
       * Prevents adding items where is_available === false.
       */
      addItem: (newItem) => {
        // Validation: Availability check
        if (newItem.is_available === false) {
          get().showToast('❌ Sorry, this dish is currently unavailable!');
          return false;
        }

        if (!newItem.id) {
          console.error('Item must have a valid Supabase UUID id:', newItem);
          return false;
        }

        let added = false;
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex >= 0) {
            // Update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: (updatedItems[existingItemIndex].quantity || 1) + (newItem.quantity || 1)
            };
            added = true;
            return { items: updatedItems };
          }

          // Add fresh item with normalized fields
          const itemToAdd = {
            id: newItem.id,
            name: newItem.name,
            price: Number(newItem.price) || 0,
            image: newItem.image || newItem.image_url || '/images/pizza.jpg',
            quantity: newItem.quantity || 1,
            restaurant_id: newItem.restaurant_id || newItem.restaurantId || null,
            restaurant_name: newItem.restaurantName || null,
            category: newItem.category || 'Mains',
            is_available: newItem.is_available !== false
          };

          added = true;
          return { items: [...state.items, itemToAdd] };
        });

        if (added) {
          get().showToast(`✨ ${newItem.name} added to your imaginary feast!`);
        }
        return added;
      },

      /**
       * Remove item by Supabase UUID
       */
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      /**
       * Increase / decrease quantity by Supabase UUID
       */
      updateQuantity: (id, delta) => {
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = (item.quantity || 1) + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean);

          return { items: updatedItems };
        });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => set({ items: [] }),

      /**
       * Get total count of dishes in cart
       */
      getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + (item.quantity || 1), 0);
      },

      /**
       * Get total imaginary price of dishes in cart
       */
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = Number(item.price) || 0;
          return total + price * (item.quantity || 1);
        }, 0);
      }
    }),
    {
      name: 'yumzo-cart-storage',
    }
  )
);

export default useCartStore;
