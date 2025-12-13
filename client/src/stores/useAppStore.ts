import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: false, // Default to closed (no dashboard feel)
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      activeCategory: 'All',
      setActiveCategory: (category) => set({ activeCategory: category }),
      theme: 'dark', 
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
    }),
    {
      name: 'yt-clone-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
