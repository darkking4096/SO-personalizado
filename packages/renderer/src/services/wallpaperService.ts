/**
 * Wallpaper Service
 * Handles wallpaper operations including rotation logic
 */

import type { RotationMode, RotationConfig } from '@shared/types/index.js'

export class WallpaperService {
  private rotationInterval: NodeJS.Timeout | null = null
  private currentIndex = 0
  private config: RotationConfig | null = null

  /**
   * Start rotation with specified configuration
   */
  startRotation(config: RotationConfig): void {
    if (config.imagePool.length === 0) {
      throw new Error('Image pool cannot be empty')
    }

    this.config = config
    this.currentIndex = 0

    // Clear any existing interval
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval)
    }

    // Start rotation loop
    this.rotationInterval = setInterval(() => {
      this.rotateImage()
    }, config.intervalMinutes * 60 * 1000)

    // Apply first image immediately
    this.rotateImage()
  }

  /**
   * Stop rotation
   */
  stopRotation(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval)
      this.rotationInterval = null
    }
    this.config = null
    this.currentIndex = 0
  }

  /**
   * Get next rotation image based on mode
   */
  getNextRotationImage(mode: RotationMode, imagePool: string[], weights?: Record<string, number>): string {
    if (imagePool.length === 0) {
      throw new Error('Image pool is empty')
    }

    switch (mode) {
      case 'sequential':
        return this.getSequentialImage(imagePool)
      case 'random':
        return this.getRandomImage(imagePool)
      case 'weighted':
        return this.getWeightedRandomImage(imagePool, weights)
      default:
        throw new Error(`Unknown rotation mode: ${mode}`)
    }
  }

  /**
   * Rotate to next image (called by interval)
   */
  rotateImage(): void {
    if (!this.config) {
      console.warn('No rotation config set')
      return
    }

    try {
      const nextImage = this.getNextRotationImage(
        this.config.mode,
        this.config.imagePool,
        this.config.weights
      )

      // Validate image path exists
      if (!this.validateImagePath(nextImage)) {
        console.warn(`Image not found: ${nextImage}, skipping`)
        // Try next image
        this.rotateImage()
        return
      }

      // Apply wallpaper (would be called via IPC in actual implementation)
      this.applyWallpaper(nextImage)
    } catch (error) {
      console.error('Error rotating wallpaper:', error)
    }
  }

  /**
   * Sequential mode: cycle through images in order
   */
  private getSequentialImage(imagePool: string[]): string {
    const image = imagePool[this.currentIndex % imagePool.length]
    this.currentIndex++
    return image
  }

  /**
   * Random mode: pick random image (may repeat)
   */
  private getRandomImage(imagePool: string[]): string {
    const randomIndex = Math.floor(Math.random() * imagePool.length)
    return imagePool[randomIndex]
  }

  /**
   * Weighted random mode: probability-based selection
   */
  private getWeightedRandomImage(imagePool: string[], weights?: Record<string, number>): string {
    if (!weights) {
      // Fallback to random if no weights provided
      return this.getRandomImage(imagePool)
    }

    // Calculate total weight
    const totalWeight = imagePool.reduce((sum, img) => sum + (weights[img] || 1), 0)

    // Generate random number between 0 and totalWeight
    const random = Math.random() * totalWeight
    let accumulatedWeight = 0

    for (const image of imagePool) {
      accumulatedWeight += weights[image] || 1
      if (random <= accumulatedWeight) {
        return image
      }
    }

    // Fallback (should not reach here)
    return imagePool[0]
  }

  /**
   * Validate image path exists (simplified version)
   * In real implementation, would check file system
   */
  private validateImagePath(imagePath: string): boolean {
    // TODO: Implement actual file system check
    // For now, return true (real implementation would use fs.existsSync)
    return imagePath.length > 0 && (imagePath.endsWith('.jpg') ||
      imagePath.endsWith('.jpeg') ||
      imagePath.endsWith('.png') ||
      imagePath.endsWith('.bmp') ||
      imagePath.endsWith('.webp'))
  }

  /**
   * Apply wallpaper (would be called via IPC)
   */
  private applyWallpaper(imagePath: string): void {
    // In real implementation, this would invoke IPC to apply wallpaper
    // For now, just log
    console.log(`Would apply wallpaper: ${imagePath}`)
  }
}

export const wallpaperService = new WallpaperService()
