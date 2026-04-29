import { create } from 'zustand'
import { TaskbarState } from '../types'

interface TaskbarStoreState extends TaskbarState {
  isApplying: boolean
  error: string | null
  previewBackgroundColor: string

  // Actions
  setPosition: (position: TaskbarState['position']) => void
  setTransparency: (transparency: number) => void
  setBackgroundColor: (color: string) => void
  setPreviewBackgroundColor: (color: string) => void
  setSize: (size: TaskbarState['size']) => void
  setVisibility: (visibility: boolean) => void
  setAutoHide: (autoHide: boolean) => void
  setIsApplying: (applying: boolean) => void
  setError: (error: string | null) => void
  setVisibleItems: (items: Record<string, boolean>) => void
  setItemVisibility: (itemName: string, visible: boolean) => void
  reset: () => void
}

const initialState = {
  position: 'bottom' as const,
  transparency: 0,
  backgroundColor: '#000000',
  size: 'default' as const,
  visibility: true,
  autoHide: false,
  visibleItems: {
    clock: false,
    systemTray: true,
    search: true,
    taskView: true,
    virtualDesktops: false,
    copilot: false,
    weather: false,
    calendar: false,
  },
  isApplying: false,
  error: null,
  previewBackgroundColor: '#000000',
}

export const useTaskbarStore = create<TaskbarStoreState>((set) => ({
  ...initialState,
  isApplying: false,
  error: null,

  setPosition: (position) => set({ position }),
  setTransparency: (transparency) => set({ transparency }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setPreviewBackgroundColor: (previewBackgroundColor) => set({ previewBackgroundColor }),
  setSize: (size) => set({ size }),
  setVisibility: (visibility) => set({ visibility }),
  setAutoHide: (autoHide) => set({ autoHide }),
  setIsApplying: (isApplying) => set({ isApplying }),
  setError: (error) => set({ error }),
  setVisibleItems: (visibleItems) => set({ visibleItems }),
  setItemVisibility: (itemName, visible) =>
    set((state) => ({
      visibleItems: {
        ...state.visibleItems,
        [itemName]: visible,
      },
    })),
  reset: () =>
    set({
      position: 'bottom',
      transparency: 0,
      backgroundColor: '#000000',
      size: 'default',
      visibility: true,
      autoHide: false,
      visibleItems: {
        clock: false,
        systemTray: true,
        search: true,
        taskView: true,
        virtualDesktops: false,
        copilot: false,
        weather: false,
        calendar: false,
      },
      isApplying: false,
      error: null,
      previewBackgroundColor: '#000000',
    }),
}))
