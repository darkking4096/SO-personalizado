import { create } from 'zustand'
import { TaskbarState } from '../types/index'

interface TaskbarStoreState extends TaskbarState {
  isApplying: boolean
  error: string | null
  previewBackgroundColor: string
  iconSize: number
  iconSpacing: number

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
  setIconSize: (size: number) => void
  setIconSpacing: (spacing: number) => void
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
  iconSize: 48,
  iconSpacing: 4,
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
  setIconSize: (iconSize) => set({ iconSize }),
  setIconSpacing: (iconSpacing) => set({ iconSpacing }),
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
      iconSize: 48,
      iconSpacing: 4,
      isApplying: false,
      error: null,
      previewBackgroundColor: '#000000',
    }),
}))
