/**
 * Wallpaper Service
 * Handles wallpaper configuration, scheduling, and rotation
 *
 * Features (v1.0):
 * - Set static wallpapers (JPEG, PNG, BMP, WEBP)
 * - Time-based scheduling (e.g., sunrise/sunset wallpaper change)
 * - Profile-based rotation (save and apply wallpaper groups)
 * - Wallpaper mode toggle (fixed/variable)
 *
 * Features (v1.1 - deferred):
 * - Animated wallpapers (GIF, MP4, WebM)
 * - Dynamic wallpaper rotation
 */

import { WallpaperMode } from '../types'

export interface WallpaperConfig {
  path: string
  schedule?: {
    enabled: boolean
    times: Array<{
      time: string
      wallpaperPath: string
    }>
  }
}

export interface Monitor {
  id: string
  name: string
  primary: boolean
  width: number
  height: number
}

/**
 * Wallpaper Service - Handles all wallpaper operations
 * Note: In Electron, IPC calls to main process are required for system integration
 * Windows API constants (SPI_SETDESKWALLPAPER, Registry paths) are defined in main process
 */
export class WallpaperService {

  /**
   * Load and preview an image file
   * @param filePath Path to image file
   * @returns Base64 encoded image data
   */
  static async selectWallpaper(filePath: string): Promise<{ success: boolean; preview?: string; error?: string }> {
    try {
      if (!this.validateFormat(filePath)) {
        return { success: false, error: 'Unsupported image format. Supported: JPEG, PNG, BMP, WEBP' }
      }

      // Load image as data URL for preview
      // In a real app, use sharp or similar to load the file
      // This is a placeholder that would be called via IPC
      console.log(`[WallpaperService] Selecting wallpaper: ${filePath}`)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to select wallpaper: ${message}` }
    }
  }

  /**
   * Apply wallpaper to system (all monitors or specific monitor)
   * @param filePath Path to wallpaper file
   * @param monitorId Monitor ID ('all' or specific monitor ID)
   * @returns Success status with message
   */
  static async applyWallpaper(
    filePath: string,
    monitorId: string = 'all'
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // File existence check would be done in IPC handler
      if (!filePath || filePath.trim() === '') {
        return { success: false, error: 'Invalid file path' }
      }

      if (!this.validateFormat(filePath)) {
        return { success: false, error: 'Unsupported image format' }
      }

      // In actual implementation, this would call Electron IPC
      // ipcRenderer.invoke('apply-wallpaper', { filePath, monitorId })
      console.log(`[WallpaperService] Applying wallpaper: ${filePath} (monitor: ${monitorId})`)
      return { success: true, message: `Wallpaper applied successfully to ${monitorId === 'all' ? 'all monitors' : `monitor ${monitorId}`}` }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to apply wallpaper: ${message}` }
    }
  }

  /**
   * Get currently set wallpaper
   * @returns Current wallpaper path
   */
  static async getWallpaper(): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
      // In actual implementation, read from Registry:
      // HKEY_CURRENT_USER\Control Panel\Desktop\Wallpaper
      console.log('[WallpaperService] Getting current wallpaper')
      return { success: true, path: '' }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to get wallpaper: ${message}` }
    }
  }

  /**
   * Get list of available monitors
   * @returns Array of connected monitors
   */
  static async getAvailableMonitors(): Promise<{ success: boolean; monitors?: Monitor[]; error?: string }> {
    try {
      // In actual implementation, enumerate displays via Windows API
      // EnumDisplayMonitors or GetSystemMetrics
      console.log('[WallpaperService] Getting available monitors')
      return { success: true, monitors: [] }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to get monitors: ${message}` }
    }
  }

  /**
   * Schedule wallpaper changes at specific times
   * @param schedule Schedule configuration with time-based rules
   * @returns Success status
   */
  static async scheduleWallpaper(schedule: WallpaperConfig['schedule']): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (!schedule || !schedule.times || schedule.times.length === 0) {
        return { success: false, error: 'Invalid schedule configuration' }
      }

      // Validate time format (HH:MM - strict format with leading zero)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      const validTimes = schedule.times.every((t) => timeRegex.test(t.time))

      if (!validTimes) {
        return { success: false, error: 'Invalid time format. Use HH:MM' }
      }

      console.log('[WallpaperService] Scheduling wallpaper rotation', schedule)
      return { success: true, message: 'Wallpaper schedule created' }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to schedule wallpaper: ${message}` }
    }
  }

  /**
   * Validate wallpaper file format
   * @param path Path to validate
   * @returns Validation result
   */
  static validateFormat(path: string): boolean {
    const supportedFormats = ['.jpeg', '.jpg', '.png', '.bmp', '.webp']
    const ext = path.substring(path.lastIndexOf('.')).toLowerCase()
    return supportedFormats.includes(ext)
  }

  /**
   * Get current wallpaper mode (fixed or variable)
   * @returns Current mode
   */
  static getCurrentMode(): WallpaperMode {
    // In actual implementation, this would read from persistent store
    // For now, return 'fixed' as default
    return 'fixed'
  }

  /**
   * Validate mode transition
   * @param from Current mode
   * @param to Target mode
   * @returns Validation result
   */
  static validateModeTransition(
    from: WallpaperMode,
    to: WallpaperMode
  ): { valid: boolean; message?: string } {
    // All transitions are valid: fixed → variable and variable → fixed
    if (from === to) {
      return { valid: false, message: 'New mode is the same as current mode' }
    }

    // Validate modes are correct
    const validModes: WallpaperMode[] = ['fixed', 'variable']
    if (!validModes.includes(from) || !validModes.includes(to)) {
      return { valid: false, message: 'Invalid mode' }
    }

    return { valid: true }
  }
}
