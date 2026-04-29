import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark'

interface ThemeStoreState {
  appTheme: ThemeMode
  windowsTheme: ThemeMode
  syncWithSystem: boolean
  accentColor: string
  previewColor: string | null // Live preview before applying
  isApplying: boolean
  error: string | null

  // Actions
  setAppTheme: (theme: ThemeMode) => void
  setWindowsTheme: (theme: ThemeMode) => void
  setSyncWithSystem: (sync: boolean) => void
  setAccentColor: (color: string) => void
  setPreviewColor: (color: string | null) => void
  setIsApplying: (applying: boolean) => void
  setError: (error: string | null) => void
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  appTheme: 'light',
  windowsTheme: 'light',
  syncWithSystem: false,
  accentColor: '#0078D4',
  previewColor: null,
  isApplying: false,
  error: null,

  setAppTheme: (theme) => set({ appTheme: theme }),
  setWindowsTheme: (theme) => set({ windowsTheme: theme }),
  setSyncWithSystem: (sync) => set({ syncWithSystem: sync }),
  setAccentColor: (color) => set({ accentColor: color }),
  setPreviewColor: (color) => set({ previewColor: color }),
  setIsApplying: (applying) => set({ isApplying: applying }),
  setError: (error) => set({ error }),
}))
