import { create } from 'zustand'
import { WallpaperMode } from '../types'

export interface Monitor {
  id: string
  name: string
  primary: boolean
  width: number
  height: number
}

interface WallpaperStoreState {
  currentWallpaper: { path: string; monitorId?: string } | null
  previewImage: string | null
  availableMonitors: Monitor[]
  selectedMonitor: string // 'all' or monitorId
  mode: WallpaperMode // 'fixed' or 'variable'
  isApplying: boolean
  error: string | null

  // Actions
  setCurrentWallpaper: (path: string, monitorId?: string) => void
  setPreviewImage: (imageData: string | null) => void
  setAvailableMonitors: (monitors: Monitor[]) => void
  setSelectedMonitor: (monitorId: string) => void
  setMode: (mode: WallpaperMode) => void
  setIsApplying: (applying: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  currentWallpaper: null,
  previewImage: null,
  availableMonitors: [],
  selectedMonitor: 'all',
  mode: 'fixed' as WallpaperMode,
  isApplying: false,
  error: null,
}

export const useWallpaperStore = create<WallpaperStoreState>((set) => ({
  ...initialState,

  setCurrentWallpaper: (path, monitorId) =>
    set({ currentWallpaper: { path, monitorId }, error: null }),

  setPreviewImage: (imageData) => set({ previewImage: imageData }),

  setAvailableMonitors: (monitors) => set({ availableMonitors: monitors }),

  setSelectedMonitor: (monitorId) => set({ selectedMonitor: monitorId }),

  setMode: (mode) => set({ mode }),

  setIsApplying: (applying) => set({ isApplying: applying }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}))
