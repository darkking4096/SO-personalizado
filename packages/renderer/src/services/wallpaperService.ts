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

import { WallpaperMode, Preset, RotationConfig } from '../types'

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

export interface Schedule {
  id: string
  time: string
  imagePath: string
  enabled: boolean
}

/**
 * Wallpaper Service - Handles all wallpaper operations
 * Note: In Electron, IPC calls to main process are required for system integration
 * Windows API constants (SPI_SETDESKWALLPAPER, Registry paths) are defined in main process
 */
export class WallpaperService {
  private static schedulerInterval: NodeJS.Timeout | null = null
  private static lastAppliedScheduleId: string | null = null
  private static schedulerStore: Map<string, Schedule> = new Map()
  private static presetStore: Map<string, Preset> = new Map()

  /**
   * Clear all schedules (for testing)
   * @private
   */
  static clearSchedules(): void {
    this.schedulerStore.clear()
    this.lastAppliedScheduleId = null
  }

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
   * Add a schedule to the scheduler
   * @param schedule Schedule to add
   * @returns Success status
   */
  static addSchedule(schedule: Schedule): { success: boolean; error?: string } {
    try {
      if (!this.validateTimeFormat(schedule.time)) {
        return { success: false, error: 'Invalid time format. Use HH:MM' }
      }

      if (!this.validateFormat(schedule.imagePath)) {
        return { success: false, error: 'Unsupported image format' }
      }

      this.schedulerStore.set(schedule.id, schedule)
      console.log(`[WallpaperService] Added schedule: ${schedule.id} at ${schedule.time}`)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to add schedule: ${message}` }
    }
  }

  /**
   * Remove a schedule from the scheduler
   * @param scheduleId Schedule ID to remove
   * @returns Success status
   */
  static removeSchedule(scheduleId: string): { success: boolean; error?: string } {
    try {
      this.schedulerStore.delete(scheduleId)
      console.log(`[WallpaperService] Removed schedule: ${scheduleId}`)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to remove schedule: ${message}` }
    }
  }

  /**
   * Get all schedules
   * @returns Array of schedules
   */
  static getSchedules(): Schedule[] {
    return Array.from(this.schedulerStore.values())
  }

  /**
   * Update a schedule
   * @param scheduleId Schedule ID to update
   * @param updates Partial schedule updates
   * @returns Success status
   */
  static updateSchedule(
    scheduleId: string,
    updates: Partial<Omit<Schedule, 'id'>>
  ): { success: boolean; error?: string } {
    try {
      const schedule = this.schedulerStore.get(scheduleId)
      if (!schedule) {
        return { success: false, error: 'Schedule not found' }
      }

      if (updates.time && !this.validateTimeFormat(updates.time)) {
        return { success: false, error: 'Invalid time format' }
      }

      if (updates.imagePath && !this.validateFormat(updates.imagePath)) {
        return { success: false, error: 'Unsupported image format' }
      }

      const updated = { ...schedule, ...updates }
      this.schedulerStore.set(scheduleId, updated)
      console.log(`[WallpaperService] Updated schedule: ${scheduleId}`)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to update schedule: ${message}` }
    }
  }

  /**
   * Start the background scheduler
   * Checks every minute for scheduled wallpaper changes
   * @returns Success status
   */
  static startScheduler(): { success: boolean; message?: string; error?: string } {
    try {
      if (this.schedulerInterval) {
        return { success: false, error: 'Scheduler is already running' }
      }

      // Check every minute
      this.schedulerInterval = setInterval(() => {
        this.checkSchedules()
      }, 60000)

      console.log('[WallpaperService] Scheduler started')
      return { success: true, message: 'Scheduler started successfully' }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to start scheduler: ${message}` }
    }
  }

  /**
   * Stop the background scheduler
   * @returns Success status
   */
  static stopScheduler(): { success: boolean; message?: string; error?: string } {
    try {
      if (this.schedulerInterval) {
        clearInterval(this.schedulerInterval)
        this.schedulerInterval = null
      }

      console.log('[WallpaperService] Scheduler stopped')
      return { success: true, message: 'Scheduler stopped successfully' }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to stop scheduler: ${message}` }
    }
  }

  /**
   * Check if any schedules should be applied
   * Allows ±5 minute tolerance window
   * @private
   */
  private static checkSchedules(): void {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`

    for (const schedule of this.schedulerStore.values()) {
      if (!schedule.enabled) continue

      // Check if current time matches scheduled time (within ±5 minutes)
      if (this.isTimeInTolerance(currentTime, schedule.time, 5)) {
        // Avoid applying the same schedule multiple times
        if (this.lastAppliedScheduleId !== schedule.id) {
          this.applyScheduledWallpaper(schedule)
          this.lastAppliedScheduleId = schedule.id
        }
      }
    }
  }

  /**
   * Check if a time is within tolerance window of scheduled time
   * @param currentTime Current time in HH:MM format
   * @param scheduledTime Scheduled time in HH:MM format
   * @param toleranceMinutes Tolerance in minutes
   * @returns True if within tolerance
   * @private
   */
  private static isTimeInTolerance(
    currentTime: string,
    scheduledTime: string,
    toleranceMinutes: number
  ): boolean {
    const [curHour, curMin] = currentTime.split(':').map(Number)
    const [schedHour, schedMin] = scheduledTime.split(':').map(Number)

    const curTotalMin = curHour * 60 + curMin
    const schedTotalMin = schedHour * 60 + schedMin

    const diff = Math.abs(curTotalMin - schedTotalMin)

    return diff <= toleranceMinutes
  }

  /**
   * Apply a scheduled wallpaper
   * @param schedule Schedule to apply
   * @private
   */
  private static async applyScheduledWallpaper(schedule: Schedule): Promise<void> {
    try {
      console.log(
        `[WallpaperService] Applying scheduled wallpaper: ${schedule.imagePath} (schedule: ${schedule.id})`
      )

      // In actual implementation, call the IPC handler to apply wallpaper
      // For now, just log the action
      const result = await this.applyWallpaper(schedule.imagePath, 'all')
      if (!result.success) {
        console.error(`[WallpaperService] Failed to apply scheduled wallpaper: ${result.error}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[WallpaperService] Error applying scheduled wallpaper: ${message}`)
    }
  }

  /**
   * Validate time format (HH:MM)
   * @param time Time string to validate
   * @returns True if valid
   * @private
   */
  private static validateTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
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

  /**
   * Get all presets (Story 1.5)
   * @returns Array of presets
   */
  static getPresets(): Preset[] {
    return Array.from(this.presetStore.values())
  }

  /**
   * Save a new preset (Story 1.5)
   * @param name Preset name
   * @param config Rotation configuration
   * @returns Preset with ID or error
   */
  static savePreset(name: string, config: RotationConfig): { success: boolean; preset?: Preset; error?: string } {
    try {
      if (!name || name.trim() === '') {
        return { success: false, error: 'Preset name cannot be empty' }
      }

      if (!config || !config.mode) {
        return { success: false, error: 'Invalid rotation configuration' }
      }

      const preset: Preset = {
        id: `preset_${Date.now()}`,
        name: name.trim(),
        config,
        createdAt: new Date(),
      }

      this.presetStore.set(preset.id, preset)
      console.log(`[WallpaperService] Saved preset: ${preset.id} (${name})`)
      return { success: true, preset }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to save preset: ${message}` }
    }
  }

  /**
   * Delete a preset (Story 1.5)
   * @param presetId Preset ID to delete
   * @returns Success status
   */
  static deletePreset(presetId: string): { success: boolean; error?: string } {
    try {
      if (!this.presetStore.has(presetId)) {
        return { success: false, error: 'Preset not found' }
      }

      this.presetStore.delete(presetId)
      console.log(`[WallpaperService] Deleted preset: ${presetId}`)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to delete preset: ${message}` }
    }
  }

  /**
   * Apply a preset configuration (Story 1.5)
   * @param presetId Preset ID to apply
   * @returns Success status with applied config
   */
  static applyPreset(presetId: string): { success: boolean; config?: RotationConfig; error?: string } {
    try {
      const preset = this.presetStore.get(presetId)
      if (!preset) {
        return { success: false, error: 'Preset not found' }
      }

      console.log(`[WallpaperService] Applied preset: ${presetId} (${preset.name})`)
      return { success: true, config: preset.config }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to apply preset: ${message}` }
    }
  }

  /**
   * Load presets from storage (Story 1.5)
   * @param presets Array of presets to load
   * @returns Success status
   */
  static loadPresets(presets: Preset[]): { success: boolean; error?: string } {
    try {
      this.presetStore.clear()
      presets.forEach((preset) => {
        this.presetStore.set(preset.id, preset)
      })
      console.log(`[WallpaperService] Loaded ${presets.length} presets`)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Failed to load presets: ${message}` }
    }
  }
}
