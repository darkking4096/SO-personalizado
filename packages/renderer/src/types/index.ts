/**
 * Shared Types for PersonalizacionSO
 * All type definitions used across packages
 */

// Wallpaper Types
export type WallpaperMode = 'fixed' | 'variable';

export type RotationMode = 'sequential' | 'random' | 'weighted-random';

export interface RotationConfig {
  mode: RotationMode;
  interval?: number; // milliseconds
  intervalMinutes?: number; // minutes (alternative to interval)
  images?: string[];
  imagePool?: string[]; // array of image paths
  weights?: number[] | Record<string, number>; // for weighted-random mode
}

export interface Preset {
  id: string;
  name: string;
  config: RotationConfig;
  createdAt: Date;
}

// Taskbar Types
export type TaskbarPosition = 'bottom' | 'top' | 'left' | 'right';
export type TaskbarSize = 'small' | 'default' | 'large' | number;

export interface TaskbarState {
  position: TaskbarPosition;
  transparency: number;
  backgroundColor: string;
  size: TaskbarSize;
  visibility: boolean;
  autoHide: boolean;
  visibleItems: Record<string, boolean>;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeState {
  mode: ThemeMode;
  accentColor: string;
}

// Shortcut Types (re-export from shortcut.ts)
export type { Shortcut, ShortcutCategory, ShortcutsDatabase } from './shortcut';

// Profile Types
export interface Profile {
  id: string;
  name: string;
  description?: string;
  wallpaper?: {
    path?: string;
    schedule?: {
      enabled: boolean;
      times: Array<{
        time: string;
        wallpaperPath: string;
      }>;
    };
  };
  taskbar?: Partial<TaskbarState>;
  theme?: Partial<ThemeState>;
  shortcuts?: string[];
  isDefault?: boolean;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// Color Preset Type
export interface ColorPreset {
  name: string;
  color: string;
  category?: string;
}
