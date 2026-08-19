import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        id: 'mock_user_123',
        name: 'Demo User',
        role: 'customer', // Default role
      },
      setRole: (newRole) =>
        set((state) => ({
          user: { ...state.user, role: newRole },
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
