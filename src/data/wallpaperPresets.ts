/**
 * Default Wallpaper Rotation Presets
 * Story 1.5: Common preset configurations for different use cases
 */

import { Preset } from '../types'

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'preset_work',
    name: 'Work',
    config: {
      mode: 'sequential',
      intervalMinutes: 30,
      imagePool: [],
    },
    createdAt: new Date(),
  },
  {
    id: 'preset_gaming',
    name: 'Gaming',
    config: {
      mode: 'random',
      intervalMinutes: 10,
      imagePool: [],
    },
    createdAt: new Date(),
  },
  {
    id: 'preset_relaxation',
    name: 'Relaxation',
    config: {
      mode: 'random',
      intervalMinutes: 60,
      imagePool: [],
    },
    createdAt: new Date(),
  },
  {
    id: 'preset_nature',
    name: 'Nature',
    config: {
      mode: 'sequential',
      intervalMinutes: 120,
      imagePool: [],
    },
    createdAt: new Date(),
  },
]
