import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getSafeStorage } from '@/lib/storage';
import { DEFAULT_FILTERS } from '@/types/board.types';
import type { Filters } from '@/types/board.types';

interface UIState {
  filters: Filters;
  isCardModalOpen: boolean;
  selectedCardId: string | null;
  isBoardSettingsOpen: boolean;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  openCardModal: (cardId: string) => void;
  closeCardModal: () => void;
  toggleBoardSettings: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      filters: DEFAULT_FILTERS,
      isCardModalOpen: false,
      selectedCardId: null,
      isBoardSettingsOpen: false,

      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        })),

      clearFilters: () =>
        set(() => ({
          filters: DEFAULT_FILTERS
        })),

      openCardModal: (cardId) =>
        set(() => ({
          isCardModalOpen: true,
          selectedCardId: cardId
        })),

      closeCardModal: () =>
        set(() => ({
          isCardModalOpen: false,
          selectedCardId: null
        })),

      toggleBoardSettings: () =>
        set((state) => ({
          isBoardSettingsOpen: !state.isBoardSettingsOpen
        }))
    }),
    {
      name: 'kanban-ui-store',
      version: 1,
      storage: createJSONStorage(getSafeStorage),
      partialize: (state) => ({
        filters: state.filters
      })
    }
  )
);
