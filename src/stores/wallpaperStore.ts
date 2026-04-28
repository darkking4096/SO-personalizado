import { create } from 'zustand'
import { WallpaperMode } from '../types'

export interface Monitor {
  id: string
  name: string
  primary: boolean
  width: number
  height: number
}

export interface Schedule {
  id: string
  time: string // HH:MM format
  imagePath: string
  enabled: boolean
  createdAt: string
}

interface WallpaperStoreState {
  currentWallpaper: { path: string; monitorId?: string } | null
  previewImage: string | null
  availableMonitors: Monitor[]
  selectedMonitor: string // 'all' or monitorId
  mode: WallpaperMode // 'fixed' or 'variable'
  isApplying: boolean
  error: string | null

  // Schedule management
  schedules: Schedule[]
  isSchedulerRunning: boolean

  // Actions
  setCurrentWallpaper: (path: string, monitorId?: string) => void
  setPreviewImage: (imageData: string | null) => void
  setAvailableMonitors: (monitors: Monitor[]) => void
  setSelectedMonitor: (monitorId: string) => void
  setMode: (mode: WallpaperMode) => void
  setIsApplying: (applying: boolean) => void
  setError: (error: string | null) => void

  // Schedule actions
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt'>) => void
  removeSchedule: (scheduleId: string) => void
  updateSchedule: (scheduleId: string, updates: Partial<Schedule>) => void
  getSchedules: () => Schedule[]
  setIsSchedulerRunning: (running: boolean) => void
  clearSchedules: () => void

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
  schedules: [],
  isSchedulerRunning: false,
}

export const useWallpaperStore = create<WallpaperStoreState>((set, get) => ({
  ...initialState,

  setCurrentWallpaper: (path, monitorId) =>
    set({ currentWallpaper: { path, monitorId }, error: null }),

  setPreviewImage: (imageData) => set({ previewImage: imageData }),

  setAvailableMonitors: (monitors) => set({ availableMonitors: monitors }),

  setSelectedMonitor: (monitorId) => set({ selectedMonitor: monitorId }),

  setMode: (mode) => set({ mode }),

  setIsApplying: (applying) => set({ isApplying: applying }),

  setError: (error) => set({ error }),

  addSchedule: (schedule) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: `schedule_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      schedules: [...state.schedules, newSchedule],
      error: null,
    }))
  },

  removeSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== scheduleId),
    })),

  updateSchedule: (scheduleId, updates) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === scheduleId ? { ...s, ...updates } : s
      ),
    })),

  getSchedules: () => get().schedules,

  setIsSchedulerRunning: (running) => set({ isSchedulerRunning: running }),

  clearSchedules: () => set({ schedules: [] }),

  reset: () => set(initialState),
}))
