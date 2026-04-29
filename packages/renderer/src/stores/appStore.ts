/**
 * Zustand App Store
 * Central state management for the renderer process
 */

import { create } from 'zustand'
import type { AppState, Profile, WallpaperState, ThemeState, TaskbarState } from '@shared/types/index.js'

interface AppStoreActions {
  // Wallpaper actions
  setWallpaper: (state: Partial<WallpaperState>) => void
  startRotation: (config: import('@shared/types/index.js').RotationConfig) => void
  stopRotation: () => void

  // Theme actions
  setTheme: (state: Partial<ThemeState>) => void
  toggleTheme: () => void

  // Taskbar actions
  setTaskbar: (state: Partial<TaskbarState>) => void

  // Profile actions
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
  setProfiles: (profiles: Profile[]) => void
  selectProfile: (id: string) => void

  // Version
  setVersion: (version: string) => void

  // Reset
  reset: () => void
}

const initialState: AppState = {
  version: '1.0.0',
  wallpaper: {
    currentPath: '',
    mode: 'fixed',
    rotation: {
      enabled: false,
      config: {
        mode: 'sequential',
        intervalMinutes: 30,
        imagePool: [],
      },
      currentIndex: 0,
      isRotating: false,
    },
  },
  theme: {
    mode: 'light',
    accentColor: '#0078D4',
  },
  taskbar: {
    position: 'bottom',
    transparency: 0,
    backgroundColor: '#000000',
    size: 'default',
    visibility: true,
    autoHide: false,
  },
  profiles: [],
}

export const useAppStore = create<AppState & AppStoreActions>((set) => ({
  ...initialState,

  // Wallpaper
  setWallpaper: (wallpaper) =>
    set((state) => ({
      wallpaper: { ...state.wallpaper, ...wallpaper },
    })),

  startRotation: (config) =>
    set((state) => ({
      wallpaper: {
        ...state.wallpaper,
        rotation: {
          enabled: true,
          config,
          currentIndex: 0,
          isRotating: true,
        },
      },
    })),

  stopRotation: () =>
    set((state) => ({
      wallpaper: {
        ...state.wallpaper,
        rotation: {
          enabled: false,
          config: state.wallpaper.rotation?.config || {
            mode: 'sequential',
            intervalMinutes: 30,
            imagePool: [],
          },
          currentIndex: 0,
          isRotating: false,
        },
      },
    })),

  // Theme
  setTheme: (theme) =>
    set((state) => ({
      theme: { ...state.theme, ...theme },
    })),
  toggleTheme: () =>
    set((state) => ({
      theme: {
        ...state.theme,
        mode: state.theme.mode === 'light' ? 'dark' : 'light',
      },
    })),

  // Taskbar
  setTaskbar: (taskbar) =>
    set((state) => ({
      taskbar: { ...state.taskbar, ...taskbar },
    })),

  // Profiles
  addProfile: (profile) =>
    set((state) => ({
      profiles: [...state.profiles, profile],
    })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
  setProfiles: (profiles) =>
    set(() => ({
      profiles,
    })),
  selectProfile: (id) =>
    set(() => ({
      selectedProfile: id,
    })),

  // Version
  setVersion: (version) =>
    set(() => ({
      version,
    })),

  // Reset
  reset: () => set(initialState),
}))
