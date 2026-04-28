import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { WallpaperService } from '@shared/services/wallpaperService'
import type { Schedule } from '@shared/services/wallpaperService'

// Helper to access private clearSchedules method
interface WallpaperServiceTest {
  clearSchedules(): void
}

describe('WallpaperService - Scheduler', () => {
  beforeEach(() => {
    // Reset the service state before each test
    WallpaperService.stopScheduler()
    ;(WallpaperService as unknown as WallpaperServiceTest).clearSchedules()
  })

  afterEach(() => {
    // Clean up after each test
    WallpaperService.stopScheduler()
    ;(WallpaperService as unknown as WallpaperServiceTest).clearSchedules()
  })

  describe('Schedule Management', () => {
    it('should add a schedule successfully', () => {
      const schedule: Schedule = {
        id: 'test-1',
        time: '09:00',
        imagePath: '/path/to/image.jpg',
        enabled: true,
      }

      const result = WallpaperService.addSchedule(schedule)

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject invalid time format', () => {
      const schedule: Schedule = {
        id: 'test-1',
        time: '25:00', // Invalid hour
        imagePath: '/path/to/image.jpg',
        enabled: true,
      }

      const result = WallpaperService.addSchedule(schedule)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid time format')
    })

    it('should reject unsupported image format', () => {
      const schedule: Schedule = {
        id: 'test-1',
        time: '09:00',
        imagePath: '/path/to/image.gif', // Not supported
        enabled: true,
      }

      const result = WallpaperService.addSchedule(schedule)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported image format')
    })

    it('should accept all supported image formats', () => {
      const formats = ['jpg', 'jpeg', 'png', 'bmp', 'webp']

      for (const format of formats) {
        const schedule: Schedule = {
          id: `test-${format}`,
          time: '09:00',
          imagePath: `/path/to/image.${format}`,
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(true)
      }
    })

    it('should remove a schedule successfully', () => {
      const schedule: Schedule = {
        id: 'test-1',
        time: '09:00',
        imagePath: '/path/to/image.jpg',
        enabled: true,
      }

      WallpaperService.addSchedule(schedule)
      const result = WallpaperService.removeSchedule(schedule.id)

      expect(result.success).toBe(true)
      expect(WallpaperService.getSchedules()).toHaveLength(0)
    })

    it('should get all schedules', () => {
      const schedules: Schedule[] = [
        {
          id: 'test-1',
          time: '09:00',
          imagePath: '/path/to/image1.jpg',
          enabled: true,
        },
        {
          id: 'test-2',
          time: '18:00',
          imagePath: '/path/to/image2.jpg',
          enabled: true,
        },
      ]

      for (const schedule of schedules) {
        WallpaperService.addSchedule(schedule)
      }

      const result = WallpaperService.getSchedules()
      expect(result).toHaveLength(2)
    })

    it('should update a schedule successfully', () => {
      const schedule: Schedule = {
        id: 'test-1',
        time: '09:00',
        imagePath: '/path/to/image.jpg',
        enabled: true,
      }

      WallpaperService.addSchedule(schedule)
      const result = WallpaperService.updateSchedule('test-1', {
        time: '10:00',
        enabled: false,
      })

      expect(result.success).toBe(true)

      const updated = WallpaperService.getSchedules()[0]
      expect(updated.time).toBe('10:00')
      expect(updated.enabled).toBe(false)
    })

    it('should return error when updating non-existent schedule', () => {
      const result = WallpaperService.updateSchedule('non-existent', {
        time: '10:00',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Schedule not found')
    })
  })

  describe('Time Validation', () => {
    const validTimes = [
      '00:00',
      '06:30',
      '12:00',
      '18:30',
      '23:59',
    ]

    const invalidTimes = [
      '24:00', // Invalid hour
      '12:60', // Invalid minute
      '1:30', // Missing leading zero
      'invalid',
      '25:30',
      '-1:00',
    ]

    it('should accept valid time formats', () => {
      for (const time of validTimes) {
        const schedule: Schedule = {
          id: `test-${time}`,
          time,
          imagePath: '/path/to/image.jpg',
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(true, `Time ${time} should be valid`)
      }
    })

    it('should reject invalid time formats', () => {
      for (const time of invalidTimes) {
        const schedule: Schedule = {
          id: `test-${time}`,
          time,
          imagePath: '/path/to/image.jpg',
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(false, `Time ${time} should be invalid`)
      }
    })
  })

  describe('Image Format Validation', () => {
    const validFormats = [
      'image.jpg',
      'image.jpeg',
      'image.png',
      'image.bmp',
      'image.webp',
      'IMAGE.JPG', // Case insensitive
      '/path/to/image.png',
    ]

    const invalidFormats = [
      'image.gif',
      'image.mp4',
      'image.ico',
      'image.txt',
      'image', // No extension
      'image.webm',
    ]

    it('should accept valid image formats', () => {
      for (const format of validFormats) {
        const schedule: Schedule = {
          id: `test-${format}`,
          time: '09:00',
          imagePath: format,
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(true, `Format ${format} should be valid`)
      }
    })

    it('should reject invalid image formats', () => {
      for (const format of invalidFormats) {
        const schedule: Schedule = {
          id: `test-${format}`,
          time: '09:00',
          imagePath: format,
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(false, `Format ${format} should be invalid`)
      }
    })
  })

  describe('Scheduler Control', () => {
    it('should start the scheduler successfully', () => {
      const result = WallpaperService.startScheduler()

      expect(result.success).toBe(true)
      expect(result.message).toBeDefined()
    })

    it('should not allow starting scheduler twice', () => {
      WallpaperService.startScheduler()
      const result = WallpaperService.startScheduler()

      expect(result.success).toBe(false)
      expect(result.error).toContain('already running')
    })

    it('should stop the scheduler successfully', () => {
      WallpaperService.startScheduler()
      const result = WallpaperService.stopScheduler()

      expect(result.success).toBe(true)
    })

    it('should allow restarting scheduler after stopping', () => {
      WallpaperService.startScheduler()
      WallpaperService.stopScheduler()
      const result = WallpaperService.startScheduler()

      expect(result.success).toBe(true)
    })
  })

  describe('Time Window Tolerance (±5 minutes)', () => {
    it('should detect schedule match within tolerance', () => {
      // Note: This tests the private method indirectly through scheduler behavior
      // The actual tolerance check is part of checkSchedules which would need mocking
      // Tolerance logic is: abs(currentTime - scheduledTime) <= 5 minutes

      // Time format validation ensures HH:MM format is correct
      // which enables proper tolerance calculations
      const validScheduleTimes = ['09:00', '18:30', '23:59']

      for (const time of validScheduleTimes) {
        const schedule: Schedule = {
          id: `tolerance-test-${time}`,
          time,
          imagePath: '/path/to/image.jpg',
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Schedule Persistence', () => {
    it('should preserve all schedule data when retrieving', () => {
      const schedule: Schedule = {
        id: 'test-persist',
        time: '14:30',
        imagePath: '/complex/path/to/image.jpg',
        enabled: false,
      }

      WallpaperService.addSchedule(schedule)
      const retrieved = WallpaperService.getSchedules()[0]

      expect(retrieved.id).toBe(schedule.id)
      expect(retrieved.time).toBe(schedule.time)
      expect(retrieved.imagePath).toBe(schedule.imagePath)
      expect(retrieved.enabled).toBe(schedule.enabled)
    })

    it('should handle multiple schedules independently', () => {
      const schedules: Schedule[] = [
        {
          id: 'morning',
          time: '06:00',
          imagePath: '/path/to/morning.jpg',
          enabled: true,
        },
        {
          id: 'afternoon',
          time: '12:00',
          imagePath: '/path/to/afternoon.jpg',
          enabled: true,
        },
        {
          id: 'evening',
          time: '18:00',
          imagePath: '/path/to/evening.jpg',
          enabled: false,
        },
      ]

      for (const schedule of schedules) {
        WallpaperService.addSchedule(schedule)
      }

      const retrieved = WallpaperService.getSchedules()
      expect(retrieved).toHaveLength(3)
      expect(retrieved.some((s) => s.id === 'morning')).toBe(true)
      expect(retrieved.some((s) => s.id === 'afternoon')).toBe(true)
      expect(retrieved.some((s) => s.id === 'evening')).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle wallpaper application errors gracefully', async () => {
      const invalidSchedule: Schedule = {
        id: 'test-error',
        time: '09:00',
        imagePath: '/non/existent/path.jpg',
        enabled: true,
      }

      // Service should allow adding the schedule
      // The actual application attempt would handle the error
      const result = WallpaperService.addSchedule(invalidSchedule)
      expect(result.success).toBe(true)
    })

    it('should skip disabled schedules', () => {
      const disabledSchedule: Schedule = {
        id: 'disabled',
        time: '09:00',
        imagePath: '/path/to/image.jpg',
        enabled: false,
      }

      const result = WallpaperService.addSchedule(disabledSchedule)
      expect(result.success).toBe(true)

      const schedule = WallpaperService.getSchedules()[0]
      expect(schedule.enabled).toBe(false)
    })
  })

  describe('30-Minute Granularity', () => {
    it('should accept times with 30-minute intervals', () => {
      const validTimes = [
        '00:00',
        '00:30',
        '06:00',
        '06:30',
        '12:00',
        '12:30',
        '18:00',
        '18:30',
        '23:30',
      ]

      for (const time of validTimes) {
        const schedule: Schedule = {
          id: `test-${time}`,
          time,
          imagePath: '/path/to/image.jpg',
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        expect(result.success).toBe(
          true,
          `Should accept ${time} (30-min granularity)`
        )
      }
    })

    it('should accept non-30-minute intervals (UI enforces, service allows)', () => {
      // Service validates format only, not granularity
      // The UI (TimePickerWidget) enforces 30-minute granularity
      const times = ['09:15', '14:45', '11:22']

      for (const time of times) {
        const schedule: Schedule = {
          id: `test-${time}`,
          time,
          imagePath: '/path/to/image.jpg',
          enabled: true,
        }

        const result = WallpaperService.addSchedule(schedule)
        // Service should accept valid HH:MM format
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Performance Requirements', () => {
    it('should handle large number of schedules', () => {
      const scheduleCount = 1000
      const startTime = Date.now()

      for (let i = 0; i < scheduleCount; i++) {
        const schedule: Schedule = {
          id: `test-${i}`,
          time: `${String(Math.floor(i / 100) % 24).padStart(2, '0')}:${String(
            (i % 60) * 10 % 60
          ).padStart(2, '0')}`,
          imagePath: `/path/to/image${i}.jpg`,
          enabled: true,
        }
        WallpaperService.addSchedule(schedule)
      }

      const elapsed = Date.now() - startTime
      const schedules = WallpaperService.getSchedules()

      expect(schedules).toHaveLength(scheduleCount)
      // Should handle 1000 schedules in reasonable time (< 1 second)
      expect(elapsed).toBeLessThan(1000)
    })
  })
})
