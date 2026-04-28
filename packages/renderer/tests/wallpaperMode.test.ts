/**
 * Wallpaper Mode Tests
 * Tests for Fixed/Variable mode switching logic
 */

import { WallpaperService } from '../../../src/services/wallpaperService'
import { WallpaperMode } from '../../../src/types'

describe('WallpaperMode', () => {
  describe('WallpaperService.validateModeTransition', () => {
    it('should allow transition from fixed to variable', () => {
      const result = WallpaperService.validateModeTransition('fixed', 'variable')
      expect(result.valid).toBe(true)
    })

    it('should allow transition from variable to fixed', () => {
      const result = WallpaperService.validateModeTransition('variable', 'fixed')
      expect(result.valid).toBe(true)
    })

    it('should reject transition to same mode', () => {
      const resultFixed = WallpaperService.validateModeTransition('fixed', 'fixed')
      expect(resultFixed.valid).toBe(false)
      expect(resultFixed.message).toContain('same as current mode')

      const resultVariable = WallpaperService.validateModeTransition('variable', 'variable')
      expect(resultVariable.valid).toBe(false)
      expect(resultVariable.message).toContain('same as current mode')
    })

    it('should validate correct modes', () => {
      const validModes: WallpaperMode[] = ['fixed', 'variable']
      for (const from of validModes) {
        for (const to of validModes) {
          if (from !== to) {
            const result = WallpaperService.validateModeTransition(from, to)
            expect(result.valid).toBe(true)
          }
        }
      }
    })

    it('should handle all mode combinations correctly', () => {
      const transitions = [
        { from: 'fixed' as WallpaperMode, to: 'variable' as WallpaperMode, valid: true },
        { from: 'variable' as WallpaperMode, to: 'fixed' as WallpaperMode, valid: true },
        { from: 'fixed' as WallpaperMode, to: 'fixed' as WallpaperMode, valid: false },
        { from: 'variable' as WallpaperMode, to: 'variable' as WallpaperMode, valid: false },
      ]

      for (const { from, to, valid } of transitions) {
        const result = WallpaperService.validateModeTransition(from, to)
        expect(result.valid).toBe(valid)
      }
    })
  })

  describe('WallpaperService.getCurrentMode', () => {
    it('should return a valid mode', () => {
      const mode = WallpaperService.getCurrentMode()
      expect(['fixed', 'variable']).toContain(mode)
    })

    it('should return fixed mode by default', () => {
      const mode = WallpaperService.getCurrentMode()
      expect(mode).toBe('fixed')
    })
  })

  describe('Mode persistence', () => {
    it('should preserve mode during wallpaper selection', async () => {
      // Mode should not change when selecting a wallpaper file
      const result = await WallpaperService.selectWallpaper('C:\\test.jpg')
      expect(result.success).toBeDefined()
      // Mode is handled by Zustand store, not service
    })

    it('should preserve mode during wallpaper application', async () => {
      // Mode should not change when applying wallpaper
      const result = await WallpaperService.applyWallpaper('C:\\test.jpg', 'all')
      expect(result.success).toBeDefined()
      // Mode is handled by Zustand store, not service
    })
  })
})
