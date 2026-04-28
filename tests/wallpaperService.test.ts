import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WallpaperService } from '../src/services/wallpaperService'

describe('WallpaperService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateFormat', () => {
    it('should accept valid image formats', () => {
      expect(WallpaperService.validateFormat('image.jpg')).toBe(true)
      expect(WallpaperService.validateFormat('image.jpeg')).toBe(true)
      expect(WallpaperService.validateFormat('image.png')).toBe(true)
      expect(WallpaperService.validateFormat('image.bmp')).toBe(true)
      expect(WallpaperService.validateFormat('image.webp')).toBe(true)
    })

    it('should accept uppercase extensions', () => {
      expect(WallpaperService.validateFormat('image.JPG')).toBe(true)
      expect(WallpaperService.validateFormat('image.PNG')).toBe(true)
    })

    it('should reject invalid image formats', () => {
      expect(WallpaperService.validateFormat('image.gif')).toBe(false)
      expect(WallpaperService.validateFormat('image.svg')).toBe(false)
      expect(WallpaperService.validateFormat('image.txt')).toBe(false)
      expect(WallpaperService.validateFormat('image.mp4')).toBe(false)
    })

    it('should reject files without extensions', () => {
      expect(WallpaperService.validateFormat('image')).toBe(false)
    })

    it('should handle full paths', () => {
      expect(WallpaperService.validateFormat('C:\\Users\\Pictures\\wallpaper.jpg')).toBe(true)
      expect(WallpaperService.validateFormat('/home/user/Pictures/wallpaper.png')).toBe(true)
      expect(WallpaperService.validateFormat('C:\\Users\\Documents\\file.txt')).toBe(false)
    })
  })

  describe('selectWallpaper', () => {
    it('should succeed for valid image format', async () => {
      const result = await WallpaperService.selectWallpaper('C:\\Users\\Pictures\\wallpaper.jpg')
      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should fail for unsupported format', async () => {
      const result = await WallpaperService.selectWallpaper('C:\\Users\\Documents\\file.gif')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported image format')
    })

    it('should return error message for invalid file', async () => {
      const result = await WallpaperService.selectWallpaper('')
      expect(result.success).toBe(false)
    })
  })

  describe('applyWallpaper', () => {
    it('should succeed with valid path and monitor ID', async () => {
      const result = await WallpaperService.applyWallpaper('C:\\Users\\Pictures\\wallpaper.jpg', 'all')
      expect(result.success).toBe(true)
      expect(result.message).toBeDefined()
    })

    it('should apply to all monitors by default', async () => {
      const result = await WallpaperService.applyWallpaper('C:\\Users\\Pictures\\wallpaper.jpg')
      expect(result.success).toBe(true)
      expect(result.message).toContain('all monitors')
    })

    it('should apply to specific monitor when monitorId provided', async () => {
      const result = await WallpaperService.applyWallpaper('C:\\Users\\Pictures\\wallpaper.jpg', 'MONITOR_1')
      expect(result.success).toBe(true)
      expect(result.message).toContain('MONITOR_1')
    })

    it('should fail for unsupported format', async () => {
      const result = await WallpaperService.applyWallpaper('C:\\Users\\Documents\\file.gif')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported image format')
    })

    it('should fail for empty path', async () => {
      const result = await WallpaperService.applyWallpaper('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid file path')
    })

    it('should handle whitespace-only paths', async () => {
      const result = await WallpaperService.applyWallpaper('   ')
      expect(result.success).toBe(false)
    })
  })

  describe('getWallpaper', () => {
    it('should return success status', async () => {
      const result = await WallpaperService.getWallpaper()
      expect(result.success).toBe(true)
    })

    it('should return a path property', async () => {
      const result = await WallpaperService.getWallpaper()
      expect(result).toHaveProperty('path')
    })
  })

  describe('getAvailableMonitors', () => {
    it('should return success status', async () => {
      const result = await WallpaperService.getAvailableMonitors()
      expect(result.success).toBe(true)
    })

    it('should return monitors array', async () => {
      const result = await WallpaperService.getAvailableMonitors()
      expect(result).toHaveProperty('monitors')
      expect(Array.isArray(result.monitors)).toBe(true)
    })
  })

  describe('scheduleWallpaper', () => {
    it('should validate schedule format', async () => {
      const schedule = {
        enabled: true,
        times: [
          { time: '09:00', wallpaperPath: 'C:\\Users\\Pictures\\morning.jpg' },
          { time: '18:00', wallpaperPath: 'C:\\Users\\Pictures\\evening.jpg' },
        ],
      }
      const result = await WallpaperService.scheduleWallpaper(schedule)
      expect(result.success).toBe(true)
    })

    it('should fail for invalid time format', async () => {
      const schedule = {
        enabled: true,
        times: [{ time: '9:00', wallpaperPath: 'C:\\Users\\Pictures\\morning.jpg' }],
      }
      const result = await WallpaperService.scheduleWallpaper(schedule)
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid time format')
    })

    it('should fail for times out of range', async () => {
      const schedule = {
        enabled: true,
        times: [{ time: '25:00', wallpaperPath: 'C:\\Users\\Pictures\\morning.jpg' }],
      }
      const result = await WallpaperService.scheduleWallpaper(schedule)
      expect(result.success).toBe(false)
    })

    it('should fail for empty schedule', async () => {
      const schedule = { enabled: true, times: [] }
      const result = await WallpaperService.scheduleWallpaper(schedule)
      expect(result.success).toBe(false)
    })

    it('should fail for null schedule', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await WallpaperService.scheduleWallpaper(null as any)
      expect(result.success).toBe(false)
    })

    it('should accept valid 24-hour time formats', async () => {
      const schedule = {
        enabled: true,
        times: [
          { time: '00:00', wallpaperPath: 'C:\\Users\\Pictures\\midnight.jpg' },
          { time: '23:59', wallpaperPath: 'C:\\Users\\Pictures\\late.jpg' },
        ],
      }
      const result = await WallpaperService.scheduleWallpaper(schedule)
      expect(result.success).toBe(true)
    })
  })

  describe('Performance', () => {
    it('validateFormat should complete in <100ms', () => {
      const start = performance.now()
      WallpaperService.validateFormat('C:\\Users\\Pictures\\wallpaper.jpg')
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('selectWallpaper should complete in <500ms', async () => {
      const start = performance.now()
      await WallpaperService.selectWallpaper('C:\\Users\\Pictures\\wallpaper.jpg')
      const duration = performance.now() - start
      expect(duration).toBeLessThan(500)
    })

    it('applyWallpaper should complete in <1000ms', async () => {
      const start = performance.now()
      await WallpaperService.applyWallpaper('C:\\Users\\Pictures\\wallpaper.jpg')
      const duration = performance.now() - start
      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Error Handling', () => {
    it('should return error object instead of throwing', async () => {
      const result = await WallpaperService.applyWallpaper('')
      expect(result).toHaveProperty('error')
      expect(result.success).toBe(false)
    })

    it('should provide user-friendly error messages', async () => {
      const result = await WallpaperService.selectWallpaper('file.gif')
      expect(result.error).toMatch(/Unsupported|format/i)
    })

    it('all methods should return response objects with success flag', async () => {
      const methods = [
        WallpaperService.selectWallpaper('test.jpg'),
        WallpaperService.applyWallpaper('test.jpg'),
        WallpaperService.getWallpaper(),
        WallpaperService.getAvailableMonitors(),
        WallpaperService.scheduleWallpaper({ enabled: true, times: [{ time: '09:00', wallpaperPath: 'test.jpg' }] }),
      ]

      const results = await Promise.all(methods)
      results.forEach((result) => {
        expect(result).toHaveProperty('success')
        expect(typeof result.success).toBe('boolean')
      })
    })
  })
})
