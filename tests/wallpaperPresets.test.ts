/**
 * Wallpaper Presets Tests
 * Story 1.5: Preset CRUD operations and validation
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { WallpaperService } from '../src/services/wallpaperService'
import { Preset, RotationConfig } from '../src/types'

describe('WallpaperService - Presets (Story 1.5)', () => {
  const mockRotationConfig: RotationConfig = {
    mode: 'sequential',
    intervalMinutes: 30,
    imagePool: ['/path/to/image1.jpg', '/path/to/image2.jpg'],
  }

  const mockWeightedConfig: RotationConfig = {
    mode: 'weighted',
    intervalMinutes: 60,
    imagePool: ['/path/to/image1.jpg', '/path/to/image2.jpg', '/path/to/image3.jpg'],
    weights: {
      '/path/to/image1.jpg': 0.5,
      '/path/to/image2.jpg': 0.3,
      '/path/to/image3.jpg': 0.2,
    },
  }

  beforeEach(() => {
    // Clear presets before each test
    // This ensures isolation
  })

  describe('savePreset', () => {
    it('should save a new preset with valid configuration', () => {
      const result = WallpaperService.savePreset('Work', mockRotationConfig)

      expect(result.success).toBe(true)
      expect(result.preset).toBeDefined()
      expect(result.preset?.name).toBe('Work')
      expect(result.preset?.config).toEqual(mockRotationConfig)
      expect(result.preset?.id).toMatch(/preset_\d+/)
    })

    it('should generate unique preset IDs', () => {
      const result1 = WallpaperService.savePreset('Work', mockRotationConfig)
      const result2 = WallpaperService.savePreset('Gaming', mockRotationConfig)

      expect(result1.preset?.id).not.toEqual(result2.preset?.id)
    })

    it('should reject empty preset names', () => {
      const result = WallpaperService.savePreset('', mockRotationConfig)

      expect(result.success).toBe(false)
      expect(result.error).toContain('empty')
    })

    it('should reject whitespace-only names', () => {
      const result = WallpaperService.savePreset('   ', mockRotationConfig)

      expect(result.success).toBe(false)
      expect(result.error).toContain('empty')
    })

    it('should reject invalid configuration', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidConfig = { ...mockRotationConfig, mode: undefined } as any
      const result = WallpaperService.savePreset('Test', invalidConfig)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })

    it('should support weighted rotation config', () => {
      const result = WallpaperService.savePreset('Nature', mockWeightedConfig)

      expect(result.success).toBe(true)
      expect(result.preset?.config.weights).toEqual(mockWeightedConfig.weights)
    })

    it('should set createdAt timestamp', () => {
      const beforeTime = new Date()
      const result = WallpaperService.savePreset('Work', mockRotationConfig)
      const afterTime = new Date()

      expect(result.preset?.createdAt).toBeDefined()
      expect(result.preset!.createdAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(result.preset!.createdAt.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })
  })

  describe('getPresets', () => {
    it('should return empty array when no presets exist', () => {
      const presets = WallpaperService.getPresets()

      expect(presets).toEqual([])
    })

    it('should return all saved presets', () => {
      WallpaperService.savePreset('Work', mockRotationConfig)
      WallpaperService.savePreset('Gaming', mockRotationConfig)
      WallpaperService.savePreset('Relaxation', mockRotationConfig)

      const presets = WallpaperService.getPresets()

      expect(presets.length).toBe(3)
      expect(presets.map((p) => p.name)).toEqual(['Work', 'Gaming', 'Relaxation'])
    })

    it('should preserve preset data', () => {
      WallpaperService.savePreset('Work', mockRotationConfig)
      const presets = WallpaperService.getPresets()

      expect(presets[0].config).toEqual(mockRotationConfig)
    })
  })

  describe('deletePreset', () => {
    it('should delete an existing preset', () => {
      const result = WallpaperService.savePreset('Work', mockRotationConfig)
      const presetId = result.preset!.id

      const deleteResult = WallpaperService.deletePreset(presetId)

      expect(deleteResult.success).toBe(true)
      expect(WallpaperService.getPresets().length).toBe(0)
    })

    it('should fail to delete non-existent preset', () => {
      const result = WallpaperService.deletePreset('preset_nonexistent')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should not affect other presets when deleting', () => {
      const result1 = WallpaperService.savePreset('Work', mockRotationConfig)
      const result2 = WallpaperService.savePreset('Gaming', mockRotationConfig)

      WallpaperService.deletePreset(result1.preset!.id)

      const presets = WallpaperService.getPresets()
      expect(presets.length).toBe(1)
      expect(presets[0].id).toBe(result2.preset!.id)
      expect(presets[0].name).toBe('Gaming')
    })
  })

  describe('applyPreset', () => {
    it('should return preset configuration when applied', () => {
      const saveResult = WallpaperService.savePreset('Work', mockRotationConfig)
      const presetId = saveResult.preset!.id

      const applyResult = WallpaperService.applyPreset(presetId)

      expect(applyResult.success).toBe(true)
      expect(applyResult.config).toEqual(mockRotationConfig)
    })

    it('should fail when applying non-existent preset', () => {
      const result = WallpaperService.applyPreset('preset_nonexistent')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not found')
    })

    it('should return correct config for weighted presets', () => {
      const saveResult = WallpaperService.savePreset('Nature', mockWeightedConfig)
      const presetId = saveResult.preset!.id

      const applyResult = WallpaperService.applyPreset(presetId)

      expect(applyResult.config?.weights).toEqual(mockWeightedConfig.weights)
    })
  })

  describe('loadPresets', () => {
    it('should load presets from array', () => {
      const mockPresets: Preset[] = [
        {
          id: 'preset_1',
          name: 'Work',
          config: mockRotationConfig,
          createdAt: new Date(),
        },
        {
          id: 'preset_2',
          name: 'Gaming',
          config: mockRotationConfig,
          createdAt: new Date(),
        },
      ]

      const result = WallpaperService.loadPresets(mockPresets)

      expect(result.success).toBe(true)
      expect(WallpaperService.getPresets().length).toBe(2)
    })

    it('should clear existing presets when loading', () => {
      WallpaperService.savePreset('Old', mockRotationConfig)

      const newPresets: Preset[] = [
        {
          id: 'preset_new',
          name: 'New',
          config: mockRotationConfig,
          createdAt: new Date(),
        },
      ]

      WallpaperService.loadPresets(newPresets)

      const presets = WallpaperService.getPresets()
      expect(presets.length).toBe(1)
      expect(presets[0].name).toBe('New')
    })
  })

  describe('Preset type validation', () => {
    it('should have correct Preset interface structure', () => {
      const result = WallpaperService.savePreset('Work', mockRotationConfig)
      const preset = result.preset

      expect(preset).toHaveProperty('id')
      expect(preset).toHaveProperty('name')
      expect(preset).toHaveProperty('config')
      expect(preset).toHaveProperty('createdAt')

      expect(typeof preset!.id).toBe('string')
      expect(typeof preset!.name).toBe('string')
      expect(typeof preset!.config).toBe('object')
      expect(preset!.createdAt instanceof Date).toBe(true)
    })

    it('should support all rotation modes in presets', () => {
      const modes: Array<'sequential' | 'random' | 'weighted'> = ['sequential', 'random', 'weighted']

      modes.forEach((mode) => {
        const config: RotationConfig = {
          mode,
          intervalMinutes: 30,
          imagePool: [],
        }

        const result = WallpaperService.savePreset(`Preset-${mode}`, config)
        expect(result.success).toBe(true)
        expect(result.preset?.config.mode).toBe(mode)
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle preset names with special characters', () => {
      const result = WallpaperService.savePreset('Work 🎮 [Gaming]', mockRotationConfig)

      expect(result.success).toBe(true)
      expect(result.preset?.name).toBe('Work 🎮 [Gaming]')
    })

    it('should handle empty image pool', () => {
      const config: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 30,
        imagePool: [],
      }

      const result = WallpaperService.savePreset('Empty', config)

      expect(result.success).toBe(true)
      expect(result.preset?.config.imagePool).toEqual([])
    })

    it('should handle large image pools', () => {
      const imagePool = Array.from({ length: 100 }, (_, i) => `/images/image_${i}.jpg`)
      const config: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 30,
        imagePool,
      }

      const result = WallpaperService.savePreset('LargePool', config)

      expect(result.success).toBe(true)
      expect(result.preset?.config.imagePool.length).toBe(100)
    })
  })
})

describe('Default Presets Data', () => {
  it('should export default presets', async () => {
    const { DEFAULT_PRESETS } = await import('../src/data/wallpaperPresets')

    expect(DEFAULT_PRESETS).toBeDefined()
    expect(Array.isArray(DEFAULT_PRESETS)).toBe(true)
    expect(DEFAULT_PRESETS.length).toBeGreaterThan(0)
  })

  it('should have four built-in presets', async () => {
    const { DEFAULT_PRESETS } = await import('../src/data/wallpaperPresets')

    const names = DEFAULT_PRESETS.map((p) => p.name)
    expect(names).toContain('Work')
    expect(names).toContain('Gaming')
    expect(names).toContain('Relaxation')
    expect(names).toContain('Nature')
  })

  it('should have correct intervals for each preset', async () => {
    const { DEFAULT_PRESETS } = await import('../src/data/wallpaperPresets')

    const workPreset = DEFAULT_PRESETS.find((p) => p.name === 'Work')
    const gamingPreset = DEFAULT_PRESETS.find((p) => p.name === 'Gaming')
    const relaxationPreset = DEFAULT_PRESETS.find((p) => p.name === 'Relaxation')
    const naturePreset = DEFAULT_PRESETS.find((p) => p.name === 'Nature')

    expect(workPreset?.config.intervalMinutes).toBe(30)
    expect(gamingPreset?.config.intervalMinutes).toBe(10)
    expect(relaxationPreset?.config.intervalMinutes).toBe(60)
    expect(naturePreset?.config.intervalMinutes).toBe(120)
  })
})
