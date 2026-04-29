/**
 * Wallpaper Store
 * Manages wallpaper scheduling, presets, and UI state
 */

import { create } from 'zustand'
import type { Preset, WallpaperMode } from '../types/index'

export interface Monitor {
  id: string
  name: string
  primary: boolean
  width: number
  height: number
}

export interface Schedule {
  id: string
  time: string
  imagePath: string
  enabled: boolean
}

interface WallpaperStoreState {
  // Scheduling
  schedules: Schedule[]
  addSchedule: (schedule: Schedule) => void
  removeSchedule: (id: string) => void
  updateSchedule: (id: string, updates: Partial<Omit<Schedule, 'id'>>) => void
  getSchedules: () => Schedule[]
  clearSchedules: () => void

  // UI State
  currentWallpaper: { path?: string; schedule?: any } | null
  previewImage: string | null
  selectedMonitor: string
  mode: WallpaperMode
  isApplying: boolean
  error: string | null
  presets: Preset[]
  activePresetId: string | null
  availableMonitors: Monitor[]

  // UI Actions
  setCurrentWallpaper: (wallpaper: { path?: string; schedule?: any } | null) => void
  setPreviewImage: (image: string | null) => void
  setSelectedMonitor: (monitor: string) => void
  setMode: (mode: WallpaperMode) => void
  setIsApplying: (applying: boolean) => void
  setError: (error: string | null) => void
  setPresets: (presets: Preset[]) => void
  setActivePresetId: (id: string | null) => void
  addPreset: (preset: Preset) => void
  deletePreset: (id: string) => void
  setAvailableMonitors: (monitors: Monitor[]) => void
}

export const useWallpaperStore = create<WallpaperStoreState>((set, get) => ({
  // Scheduling state
  schedules: [],

  addSchedule: (schedule: Schedule) => {
    set((state) => ({
      schedules: [...state.schedules, schedule],
    }))
  },

  removeSchedule: (id: string) => {
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    }))
  },

  updateSchedule: (id: string, updates: Partial<Omit<Schedule, 'id'>>) => {
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }))
  },

  getSchedules: () => get().schedules,

  clearSchedules: () => {
    set({ schedules: [] })
  },

  // UI State
  currentWallpaper: null,
  previewImage: null,
  selectedMonitor: 'all',
  mode: 'fixed' as WallpaperMode,
  isApplying: false,
  error: null,
  presets: [],
  activePresetId: null,
  availableMonitors: [],

  // UI Actions
  setCurrentWallpaper: (wallpaper) => set({ currentWallpaper: wallpaper }),
  setPreviewImage: (image) => set({ previewImage: image }),
  setSelectedMonitor: (monitor) => set({ selectedMonitor: monitor }),
  setMode: (mode) => set({ mode }),
  setIsApplying: (applying) => set({ isApplying: applying }),
  setError: (error) => set({ error }),
  setPresets: (presets) => set({ presets }),
  setActivePresetId: (id) => set({ activePresetId: id }),
  addPreset: (preset) => {
    set((state) => ({
      presets: [...state.presets, preset],
    }))
  },
  deletePreset: (id) => {
    set((state) => ({
      presets: state.presets.filter((p) => p.id !== id),
    }))
  },
  setAvailableMonitors: (monitors) => set({ availableMonitors: monitors }),
}))
