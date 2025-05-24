import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

// Interface untuk state autentikasi
interface AuthState {
  user: User;                          // Data user yang sedang login
  login: (username: string) => void;   // Fungsi untuk login user
  logout: () => void;                  // Fungsi untuk logout user
}

// Store autentikasi menggunakan Zustand dengan persist middleware
// untuk menyimpan state di localStorage agar tetap ada setelah refresh
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // State awal: user tidak login
      user: { username: "", isLoggedIn: false },

      // Fungsi login: set username dan status login menjadi true
      login: (username: string) =>
        set({ user: { username, isLoggedIn: true } }),

      // Fungsi logout: reset state user ke kondisi awal
      logout: () => set({ user: { username: "", isLoggedIn: false } }),
    }),
    {
      // Nama key untuk menyimpan state di localStorage
      name: "auth-storage",
    }
  )
);
