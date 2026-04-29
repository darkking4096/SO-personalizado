import { create } from 'zustand'
import { WallpaperMode, Preset } from '../types'

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

  // Preset management (Story 1.5)
  presets: Preset[]
  activePresetId: string | null

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

  // Preset actions (Story 1.5)
  addPreset: (preset: Omit<Preset, 'id' | 'createdAt'>) => void
  deletePreset: (presetId: string) => void
  applyPreset: (presetId: string) => void
  setPresets: (presets: Preset[]) => void
  getPresets: () => Preset[]
  setActivePresetId: (presetId: string | null) => void

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
  presets: [],
  activePresetId: null,
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

  // Preset actions (Story 1.5)
  addPreset: (preset) => {
    const newPreset: Preset = {
      ...preset,
      id: `preset_${Date.now()}`,
      createdAt: new Date(),
    }
    set(({ presets }) => ({
      presets: [...presets, newPreset],
      error: null,
    }))
  },

  deletePreset: (presetId) =>
    set((state) => ({
      presets: state.presets.filter((p) => p.id !== presetId),
      activePresetId: state.activePresetId === presetId ? null : state.activePresetId,
    })),

  applyPreset: (presetId) => {
    set({
      activePresetId: presetId,
    })
  },

  setPresets: (presets) => set({ presets }),

  getPresets: () => get().presets,

  setActivePresetId: (presetId) => set({ activePresetId: presetId }),

  reset: () => set(initialState),
}))
