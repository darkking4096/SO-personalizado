import { create } from 'zustand'
import { TaskbarState } from '../types'

interface TaskbarStoreState extends TaskbarState {
  isApplying: boolean
  error: string | null

  // Actions
  setPosition: (position: TaskbarState['position']) => void
  setTransparency: (transparency: boolean) => void
  setSize: (size: TaskbarState['size']) => void
  setVisibility: (visibility: boolean) => void
  setAutoHide: (autoHide: boolean) => void
  setIsApplying: (applying: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  position: 'bottom' as const,
  transparency: false,
  color: undefined,
  size: 'medium' as const,
  visibility: true,
  autoHide: false,
  isApplying: false,
  error: null,
}

export const useTaskbarStore = create<TaskbarStoreState>((set) => ({
  ...initialState,
  isApplying: false,
  error: null,

  setPosition: (position) => set({ position }),
  setTransparency: (transparency) => set({ transparency }),
  setSize: (size) => set({ size }),
  setVisibility: (visibility) => set({ visibility }),
  setAutoHide: (autoHide) => set({ autoHide }),
  setIsApplying: (isApplying) => set({ isApplying }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      position: 'bottom',
      transparency: false,
      color: undefined,
      size: 'medium',
      visibility: true,
      autoHide: false,
      isApplying: false,
      error: null,
    }),
}))
