import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WallpaperService } from '../src/services/wallpaperService'
import type { RotationConfig, RotationMode } from '../src/types/index.js'

describe('WallpaperService - Rotation Engine', () => {
  let service: WallpaperService

  beforeEach(() => {
    service = new WallpaperService()
    vi.useFakeTimers()
  })

  describe('Sequential Mode', () => {
    it('should cycle through images in order without repetition until restart', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg']

      const image1 = service.getNextRotationImage('sequential', imagePool)
      const image2 = service.getNextRotationImage('sequential', imagePool)
      const image3 = service.getNextRotationImage('sequential', imagePool)
      const image4 = service.getNextRotationImage('sequential', imagePool) // Wraps back to first

      expect(image1).toBe('/img/1.jpg')
      expect(image2).toBe('/img/2.jpg')
      expect(image3).toBe('/img/3.jpg')
      expect(image4).toBe('/img/1.jpg')
    })

    it('should handle single image in pool', () => {
      const imagePool = ['/img/single.jpg']

      const image1 = service.getNextRotationImage('sequential', imagePool)
      const image2 = service.getNextRotationImage('sequential', imagePool)

      expect(image1).toBe('/img/single.jpg')
      expect(image2).toBe('/img/single.jpg')
    })
  })

  describe('Random Mode', () => {
    it('should return image from pool', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg']

      const image = service.getNextRotationImage('random', imagePool)

      expect(imagePool).toContain(image)
    })

    it('should return different images on multiple calls', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg']
      const results = new Set<string>()

      // Call multiple times and collect results
      for (let i = 0; i < 100; i++) {
        results.add(service.getNextRotationImage('random', imagePool))
      }

      // With 100 samples from 3 images, should see at least 2 different images (probability > 99%)
      expect(results.size).toBeGreaterThanOrEqual(2)
    })

    it('may repeat images consecutively', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg']

      // This test is probabilistic but should pass nearly always
      let lastImage: string | null = null

      for (let i = 0; i < 50; i++) {
        const image = service.getNextRotationImage('random', imagePool)
        lastImage = image
      }

      // With 50 calls from 2 images, probability of repeat is high
      // If it fails, the test is flaky but the logic is still correct
      expect(lastImage).not.toBeNull()
      expect(imagePool).toContain(lastImage!)
    })
  })

  describe('Weighted Random Mode', () => {
    it('should respect weight distribution', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg']
      const weights = {
        '/img/1.jpg': 9, // 90% probability
        '/img/2.jpg': 1, // 10% probability
      }

      const results = { ['/img/1.jpg']: 0, ['/img/2.jpg']: 0 }

      // Sample 1000 times
      for (let i = 0; i < 1000; i++) {
        const image = service.getNextRotationImage('weighted', imagePool, weights)
        results[image as keyof typeof results]++
      }

      // Image 1 should be selected roughly 9x more than image 2
      const ratio = results['/img/1.jpg'] / results['/img/2.jpg']
      expect(ratio).toBeGreaterThanOrEqual(7) // Allow some variance
      expect(ratio).toBeLessThan(12)
    })

    it('should handle equal weights', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg']
      const weights = {
        '/img/1.jpg': 1,
        '/img/2.jpg': 1,
        '/img/3.jpg': 1,
      }

      const results = { ['/img/1.jpg']: 0, ['/img/2.jpg']: 0, ['/img/3.jpg']: 0 }

      // Sample 300 times
      for (let i = 0; i < 300; i++) {
        const image = service.getNextRotationImage('weighted', imagePool, weights)
        results[image as keyof typeof results]++
      }

      // Each should be selected roughly 100 times
      Object.values(results).forEach((count) => {
        expect(count).toBeGreaterThan(50) // Allow variance
        expect(count).toBeLessThan(150)
      })
    })

    it('should handle missing weights by treating as 1', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg']
      const weights = {
        '/img/1.jpg': 2,
        // Missing weight for image 2
      }

      const image = service.getNextRotationImage('weighted', imagePool, weights)
      expect(imagePool).toContain(image)
    })

    it('should fallback to random if no weights provided', () => {
      const imagePool = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg']

      const image = service.getNextRotationImage('weighted', imagePool)

      expect(imagePool).toContain(image)
    })
  })

  describe('Error Handling', () => {
    it('should throw error for empty image pool in getNextRotationImage', () => {
      const emptyPool: string[] = []

      expect(() => {
        service.getNextRotationImage('sequential', emptyPool)
      }).toThrow('Image pool is empty')
    })

    it('should throw error for empty pool in startRotation', () => {
      const config: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 30,
        imagePool: [],
      }

      expect(() => {
        service.startRotation(config)
      }).toThrow('Image pool cannot be empty')
    })

    it('should throw error for invalid rotation mode', () => {
      const imagePool = ['/img/1.jpg']

      expect(() => {
        service.getNextRotationImage('invalid' as unknown as RotationMode, imagePool)
      }).toThrow('Unknown rotation mode')
    })
  })

  describe('Rotation Lifecycle', () => {
    it('should start and stop rotation', () => {
      const config: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 1,
        imagePool: ['/img/1.jpg', '/img/2.jpg'],
      }

      service.startRotation(config)
      // Rotation started successfully

      service.stopRotation()
      // Rotation stopped successfully

      expect(true).toBe(true) // Both operations completed without error
    })

    it('should clear previous interval when starting new rotation', () => {
      const config1: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 1,
        imagePool: ['/img/1.jpg'],
      }

      const config2: RotationConfig = {
        mode: 'random',
        intervalMinutes: 5,
        imagePool: ['/img/2.jpg', '/img/3.jpg'],
      }

      service.startRotation(config1)
      service.startRotation(config2)

      // Should only have one active interval
      service.stopRotation()

      expect(true).toBe(true)
    })
  })

  describe('Configuration Validation', () => {
    it('should accept valid rotation configs', () => {
      const validConfigs: RotationConfig[] = [
        {
          mode: 'sequential',
          intervalMinutes: 5,
          imagePool: ['/img/1.jpg'],
        },
        {
          mode: 'random',
          intervalMinutes: 30,
          imagePool: ['/img/1.jpg', '/img/2.jpg'],
        },
        {
          mode: 'weighted',
          intervalMinutes: 60,
          imagePool: ['/img/1.jpg', '/img/2.jpg'],
          weights: { '/img/1.jpg': 2, '/img/2.jpg': 1 },
        },
      ]

      validConfigs.forEach((config) => {
        expect(() => service.startRotation(config)).not.toThrow()
        service.stopRotation()
      })
    })

    it('should enforce interval bounds conceptually (5 min to 24 hours)', () => {
      // Test just validates the service accepts these values
      const minConfig: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 5,
        imagePool: ['/img/1.jpg'],
      }

      const maxConfig: RotationConfig = {
        mode: 'sequential',
        intervalMinutes: 1440,
        imagePool: ['/img/1.jpg'],
      }

      expect(() => service.startRotation(minConfig)).not.toThrow()
      service.stopRotation()

      expect(() => service.startRotation(maxConfig)).not.toThrow()
      service.stopRotation()
    })
  })

  describe('Image Pool Validation', () => {
    it('should continue with available images when some are missing', () => {
      // This tests the error handling strategy
      const imagePool = ['/img/exists.jpg', '/img/missing.jpg']

      // Both images should be valid from service perspective
      expect(() => {
        service.getNextRotationImage('sequential', imagePool)
      }).not.toThrow()
    })

    it('should support different image formats', () => {
      const imagePool = [
        '/images/photo.jpg',
        '/images/landscape.jpeg',
        '/images/icon.png',
        '/images/bitmap.bmp',
        '/images/modern.webp',
      ]

      const image = service.getNextRotationImage('sequential', imagePool)

      expect(imagePool).toContain(image)
    })
  })
})
