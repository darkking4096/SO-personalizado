/**
 * Default Wallpaper Presets
 * Collection of pre-configured rotation settings for quick setup
 */

import type { Preset } from '../types/index'

export const wallpaperPresets: Preset[] = [
  {
    id: 'preset_daily',
    name: 'Daily Rotation',
    config: {
      mode: 'sequential',
      intervalMinutes: 1440, // 24 hours
      imagePool: [],
    },
    createdAt: new Date(),
  },
  {
    id: 'preset_hourly',
    name: 'Hourly Rotation',
    config: {
      mode: 'random',
      intervalMinutes: 60,
      imagePool: [],
    },
    createdAt: new Date(),
  },
  {
    id: 'preset_frequent',
    name: 'Frequent Rotation',
    config: {
      mode: 'random',
      intervalMinutes: 5,
      imagePool: [],
    },
    createdAt: new Date(),
  },
]
