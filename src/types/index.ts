/**
 * Shared Type Definitions
 * Used across main process and renderer
 */

// Wallpaper types
export type WallpaperMode = 'fixed' | 'variable'

export type RotationMode = 'sequential' | 'random' | 'weighted'

export interface RotationConfig {
  mode: RotationMode
  intervalMinutes: number
  imagePool: string[]
  weights?: Record<string, number>
}

export interface WallpaperState {
  currentPath: string
  mode: WallpaperMode
  schedule?: {
    enabled: boolean
    times: Array<{
      time: string
      wallpaperPath: string
    }>
  }
  rotation?: {
    enabled: boolean
    config: RotationConfig
    currentIndex: number
    isRotating: boolean
  }
}

// Theme types
export type ThemeMode = 'light' | 'dark'
export interface ThemeState {
  mode: ThemeMode
  accentColor: string
}

// Taskbar types
export type TaskbarSizePreset = 'small' | 'default' | 'large'
export type TaskbarSize = TaskbarSizePreset | number // preset or custom pixel height

export interface TaskbarState {
  position: 'top' | 'bottom' | 'left' | 'right'
  transparency: number
  backgroundColor: string
  size: TaskbarSize
  visibility: boolean
  autoHide: boolean
  visibleItems?: Record<string, boolean>
}

// Keyboard types
export interface KeyboardShortcut {
  id: string
  name: string
  description: string
  keys: string
  app: string
  category: string
}

// Preset types (Story 1.5)
export interface Preset {
  id: string
  name: string
  config: RotationConfig
  createdAt: Date
}

// Profile types
export interface Profile {
  id: string
  name: string
  description?: string
  wallpaper?: string
  taskbar?: Partial<TaskbarState>
  theme?: ThemeState
  shortcuts?: string[]
  rotation?: {
    presets?: Preset[]
    activePresetId?: string | null
  }
  createdAt: string
  updatedAt: string
}

// App state (Zustand store)
export interface AppState {
  version: string
  wallpaper: WallpaperState
  theme: ThemeState
  taskbar: TaskbarState
  profiles: Profile[]
  selectedProfile?: string
}

// IPC Response types
export interface IpcResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Windows API integration types
export interface WindowsRegistryEntry {
  hive: string
  path: string
  key: string
  value?: unknown
  type?: 'string' | 'dword' | 'binary'
}
