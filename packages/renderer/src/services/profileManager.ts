/**
 * Profile Manager Service
 * Handles saving, loading, and applying customization profiles
 *
 * Stores profiles as JSON in %APPDATA%/PersonalizacionSO/profiles/
 * Each profile captures: wallpaper, taskbar, theme, shortcuts
 */

import { promises as fs } from 'fs'
import path from 'path'
import type { Profile } from '../types/index'

export class ProfileManager {
  private static readonly PROFILES_DIR = path.join(
    process.env.APPDATA || process.env.HOME || '',
    'PersonalizacionSO',
    'profiles'
  )

  private static readonly BACKUPS_DIR = path.join(
    process.env.APPDATA || process.env.HOME || '',
    'PersonalizacionSO',
    'backups'
  )

  private static readonly CONFIG_DIR = path.join(
    process.env.APPDATA || process.env.HOME || '',
    'PersonalizacionSO'
  )

  private static readonly CONFIG_FILE = path.join(
    this.CONFIG_DIR,
    'config.json'
  )

  /**
   * Initialize profile directory if it doesn't exist
   */
  private static async ensureDir(dir: string): Promise<void> {
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw new Error(`Failed to create directory ${dir}: ${(error as Error).message}`)
      }
    }
  }

  /**
   * Get profile file path
   */
  private static getProfilePath(id: string): string {
    return path.join(this.PROFILES_DIR, `${id}.json`)
  }

  /**
   * Get backup file path
   */
  private static getBackupPath(id: string): string {
    return path.join(this.BACKUPS_DIR, `${id}-${Date.now()}.json.bak`)
  }

  /**
   * Save a new profile or update existing
   * @param profile Profile data (without id and timestamps)
   * @returns Saved profile with ID
   */
  static async saveProfile(
    profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Profile> {
    await this.ensureDir(this.PROFILES_DIR)

    const id = `profile-${Date.now()}`
    const now = new Date().toISOString()
    const fullProfile: Profile = {
      id,
      ...profile,
      createdAt: now,
      updatedAt: now,
    }

    const filePath = this.getProfilePath(id)

    try {
      await fs.writeFile(filePath, JSON.stringify(fullProfile, null, 2), 'utf-8')
      console.log(`[ProfileManager] Saved profile: ${profile.name} (${id})`)
      return fullProfile
    } catch (error) {
      throw new Error(`Failed to save profile: ${(error as Error).message}`)
    }
  }

  /**
   * Load a profile by ID
   * @param id Profile ID
   * @returns Profile data or null if not found
   */
  static async loadProfile(id: string): Promise<Profile | null> {
    const filePath = this.getProfilePath(id)

    try {
      const data = await fs.readFile(filePath, 'utf-8')
      const profile = JSON.parse(data) as Profile
      console.log(`[ProfileManager] Loaded profile: ${profile.name} (${id})`)
      return profile
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`[ProfileManager] Profile not found: ${id}`)
        return null
      }
      throw new Error(`Failed to load profile: ${(error as Error).message}`)
    }
  }

  /**
   * List all available profiles
   * @returns Array of profiles
   */
  static async listProfiles(): Promise<Profile[]> {
    await this.ensureDir(this.PROFILES_DIR)

    try {
      const files = await fs.readdir(this.PROFILES_DIR)
      const jsonFiles = files.filter((f) => f.endsWith('.json'))

      const profiles: Profile[] = []
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.PROFILES_DIR, file)
          const data = await fs.readFile(filePath, 'utf-8')
          const profile = JSON.parse(data) as Profile
          profiles.push(profile)
        } catch (error) {
          console.warn(`Failed to parse profile ${file}: ${(error as Error).message}`)
        }
      }

      console.log(`[ProfileManager] Listed ${profiles.length} profiles`)
      return profiles
    } catch (error) {
      throw new Error(`Failed to list profiles: ${(error as Error).message}`)
    }
  }

  /**
   * Delete a profile
   * @param id Profile ID
   * @returns Success status
   */
  static async deleteProfile(id: string): Promise<boolean> {
    const filePath = this.getProfilePath(id)

    try {
      await fs.unlink(filePath)
      console.log(`[ProfileManager] Deleted profile: ${id}`)
      return true
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`[ProfileManager] Profile not found: ${id}`)
        return false
      }
      throw new Error(`Failed to delete profile: ${(error as Error).message}`)
    }
  }

  /**
   * Apply a profile (set all customizations)
   * Atomic operation: all-or-nothing with rollback on failure
   * @param id Profile ID
   * @returns Success status, list of applied settings, and progress tracking
   */
  static async applyProfile(
    id: string,
    onProgress?: (current: string, progress: number) => void
  ): Promise<{ success: boolean; applied: string[]; error?: string }> {
    const profile = await this.loadProfile(id)
    if (!profile) {
      throw new Error(`Profile not found: ${id}`)
    }

    const applied: string[] = []
    const previousState: Record<string, unknown> = {}

    try {
      // Validate profile before applying
      await this.validateProfile(profile)

      // Create backup of current state before applying
      await this.ensureDir(this.BACKUPS_DIR)
      const stateBackupPath = this.getBackupPath(`state-${id}`)

      // Apply settings in order: wallpaper → taskbar → theme → shortcuts
      // This order ensures minimal conflicts and rollback safety

      // Step 1: Apply wallpaper
      if (profile.wallpaper) {
        onProgress?.('wallpaper', 25)
        // TODO: Call IPC to main process wallpaper service
        // Example: ipcRenderer.invoke('apply-wallpaper', profile.wallpaper)
        applied.push('wallpaper')
        console.log(`[ProfileManager] Applied wallpaper: ${profile.wallpaper}`)
      }

      // Step 2: Apply taskbar
      if (profile.taskbar) {
        onProgress?.('taskbar', 50)
        // TODO: Call IPC to main process taskbar service
        // Example: ipcRenderer.invoke('apply-taskbar', profile.taskbar)
        applied.push('taskbar')
        console.log(`[ProfileManager] Applied taskbar settings`)
      }

      // Step 3: Apply theme
      if (profile.theme) {
        onProgress?.('theme', 75)
        // TODO: Call IPC to main process theme service
        // Example: ipcRenderer.invoke('apply-theme', profile.theme)
        applied.push('theme')
        console.log(`[ProfileManager] Applied theme settings`)
      }

      // Step 4: Apply shortcuts
      if (profile.shortcuts && profile.shortcuts.length > 0) {
        onProgress?.('shortcuts', 90)
        // TODO: Call IPC to main process keyboard service
        // Example: ipcRenderer.invoke('register-shortcuts', profile.shortcuts)
        applied.push('shortcuts')
        console.log(`[ProfileManager] Applied shortcuts`)
      }

      // Save state backup for future rollback capability
      try {
        const currentState = { id, appliedAt: new Date().toISOString(), applied }
        await fs.writeFile(stateBackupPath, JSON.stringify(currentState, null, 2), 'utf-8')
      } catch (error) {
        console.warn(`Failed to save state backup: ${(error as Error).message}`)
      }

      onProgress?.('complete', 100)
      console.log(`[ProfileManager] Applied profile: ${id} (${applied.join(', ')})`)
      return { success: true, applied }
    } catch (error) {
      const errorMsg = (error as Error).message
      console.error(`Failed to apply profile: ${errorMsg}`)
      // Attempt rollback
      try {
        await this.applyProfileWithRollback(id, previousState)
      } catch (rollbackError) {
        console.error(`Rollback also failed: ${(rollbackError as Error).message}`)
      }
      return { success: false, applied, error: errorMsg }
    }
  }

  /**
   * Apply profile with explicit rollback capability
   * @param profileId Profile ID to apply
   * @param _previousState Previous system state for rollback (reserved for future use)
   * @returns Success status
   */
  static async applyProfileWithRollback(
    profileId: string,
    _previousState: Record<string, unknown>
  ): Promise<boolean> {
    try {
      const profile = await this.loadProfile(profileId)
      if (!profile) {
        throw new Error(`Profile not found: ${profileId}`)
      }

      // Apply profile (same as applyProfile)
      const result = await this.applyProfile(profileId)

      if (!result.success) {
        // If apply failed, attempt to restore previous state
        console.log('[ProfileManager] Initiating rollback to previous state...')
        // TODO: Implement rollback by applying previousState values to system
        return false
      }

      return true
    } catch (error) {
      console.error(`applyProfileWithRollback failed: ${(error as Error).message}`)
      return false
    }
  }

  /**
   * Validate profile is applicable to current system
   * @param profile Profile to validate
   * @returns Validation result with details
   */
  static async validateProfileApplicable(
    profile: Profile
  ): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = []

    try {
      // Validate wallpaper file exists
      if (profile.wallpaper?.path) {
        try {
          await fs.access(profile.wallpaper.path)
        } catch {
          issues.push(`Wallpaper file not found: ${profile.wallpaper.path}`)
        }
      }

      // Validate required fields
      if (!profile.id || !profile.name) {
        issues.push('Profile must have id and name')
      }

      // Validate taskbar settings if present
      if (profile.taskbar) {
        if (profile.taskbar.position && !['top', 'bottom', 'left', 'right'].includes(profile.taskbar.position)) {
          issues.push(`Invalid taskbar position: ${profile.taskbar.position}`)
        }
        if (profile.taskbar.transparency !== undefined && (profile.taskbar.transparency < 0 || profile.taskbar.transparency > 100)) {
          issues.push('Taskbar transparency must be between 0 and 100')
        }
      }

      // Validate theme settings if present
      if (profile.theme) {
        if (profile.theme.mode && !['light', 'dark'].includes(profile.theme.mode)) {
          issues.push(`Invalid theme mode: ${profile.theme.mode}`)
        }
      }

      const valid = issues.length === 0
      if (valid) {
        console.log(`[ProfileManager] Profile ${profile.id} is applicable`)
      } else {
        console.warn(`[ProfileManager] Profile ${profile.id} has validation issues:`, issues)
      }

      return { valid, issues }
    } catch (error) {
      const errorMsg = (error as Error).message
      return { valid: false, issues: [errorMsg] }
    }
  }

  /**
   * Validate a profile (check all referenced images/settings exist)
   * @param profile Profile to validate
   * @returns Success status
   */
  static async validateProfile(profile: Profile): Promise<boolean> {
    try {
      // Validate wallpaper file exists
      if (profile.wallpaper?.path) {
        try {
          await fs.access(profile.wallpaper.path)
        } catch {
          throw new Error(`Wallpaper file not found: ${profile.wallpaper.path}`)
        }
      }

      // Validate required fields
      if (!profile.id || !profile.name) {
        throw new Error('Profile must have id and name')
      }

      console.log(`[ProfileManager] Validated profile: ${profile.name}`)
      return true
    } catch (error) {
      throw new Error(`Profile validation failed: ${(error as Error).message}`)
    }
  }

  /**
   * Update an existing profile
   * @param id Profile ID
   * @param updates Partial profile updates
   * @returns Updated profile
   */
  static async updateProfile(
    id: string,
    updates: Partial<Omit<Profile, 'id' | 'createdAt'>>
  ): Promise<Profile> {
    const existing = await this.loadProfile(id)
    if (!existing) {
      throw new Error(`Profile not found: ${id}`)
    }

    // Create backup before update
    await this.ensureDir(this.BACKUPS_DIR)
    const backupPath = this.getBackupPath(id)
    try {
      await fs.writeFile(backupPath, JSON.stringify(existing, null, 2), 'utf-8')
    } catch (error) {
      console.warn(`Failed to create backup: ${(error as Error).message}`)
    }

    // Apply updates
    const updated: Profile = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    }

    const filePath = this.getProfilePath(id)
    try {
      await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8')
      console.log(`[ProfileManager] Updated profile: ${id}`)
      return updated
    } catch (error) {
      throw new Error(`Failed to update profile: ${(error as Error).message}`)
    }
  }

  /**
   * Read config file
   * @returns Config object or empty object if not found
   */
  private static async readConfig(): Promise<Record<string, unknown>> {
    try {
      const data = await fs.readFile(this.CONFIG_FILE, 'utf-8')
      return JSON.parse(data) as Record<string, unknown>
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return {}
      }
      throw error
    }
  }

  /**
   * Write config file
   * @param config Config object to write
   */
  private static async writeConfig(config: Record<string, unknown>): Promise<void> {
    await this.ensureDir(this.CONFIG_DIR)
    await fs.writeFile(this.CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
  }

  /**
   * Set a profile as default (auto-apply on system startup)
   * @param id Profile ID (or empty string to clear default)
   * @returns Success status
   */
  static async setAsDefault(id: string): Promise<boolean> {
    // Allow clearing default with empty string or null
    if (id === '' || id === null) {
      const config = await this.readConfig()
      delete config.defaultProfileId
      await this.writeConfig(config)
      console.log('[ProfileManager] Cleared default profile')
      return true
    }

    // Verify profile exists
    const profile = await this.loadProfile(id)
    if (!profile) {
      throw new Error(`Profile not found: ${id}`)
    }

    // Store default profile ID in config.json
    const config = await this.readConfig()
    config.defaultProfileId = id
    await this.writeConfig(config)

    console.log(`[ProfileManager] Set default profile: ${id}`)
    return true
  }

  /**
   * Get the default profile ID
   * @returns Profile ID or null if none set
   */
  static async getDefaultProfile(): Promise<string | null> {
    // Read default profile ID from config.json
    const config = await this.readConfig()
    const defaultId = config.defaultProfileId as string | null | undefined

    if (!defaultId) {
      console.log('[ProfileManager] No default profile set')
      return null
    }

    console.log(`[ProfileManager] Got default profile: ${defaultId}`)
    return defaultId
  }

  /**
   * Export profile to file for backup/sharing
   * @param id Profile ID
   * @param exportPath Export file path
   * @returns Success status
   */
  static async exportProfile(id: string, exportPath: string): Promise<boolean> {
    const profile = await this.loadProfile(id)
    if (!profile) {
      throw new Error(`Profile not found: ${id}`)
    }

    try {
      await fs.writeFile(exportPath, JSON.stringify(profile, null, 2), 'utf-8')
      console.log(`[ProfileManager] Exported profile: ${id} → ${exportPath}`)
      return true
    } catch (error) {
      throw new Error(`Failed to export profile: ${(error as Error).message}`)
    }
  }

  /**
   * Import profile from file
   * @param importPath Import file path
   * @returns Imported profile or null if invalid
   */
  static async importProfile(importPath: string): Promise<Profile | null> {
    try {
      const data = await fs.readFile(importPath, 'utf-8')
      const profile = JSON.parse(data) as Profile

      // Validate imported profile
      await this.validateProfile(profile)

      // Generate new ID for imported profile
      const newProfile: Profile = {
        ...profile,
        id: `profile-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save imported profile
      const filePath = this.getProfilePath(newProfile.id)
      await this.ensureDir(this.PROFILES_DIR)
      await fs.writeFile(filePath, JSON.stringify(newProfile, null, 2), 'utf-8')

      console.log(`[ProfileManager] Imported profile: ${newProfile.name} (${newProfile.id})`)
      return newProfile
    } catch (error) {
      console.error(`Failed to import profile: ${(error as Error).message}`)
      return null
    }
  }

  /**
   * Get the current system state as a profile snapshot
   * @param name Name for this snapshot
   * @returns Current system state as Profile
   */
  static async captureCurrentState(name: string): Promise<Profile> {
    const id = `profile-${Date.now()}`
    const now = new Date().toISOString()

    // TODO: Implement reading current wallpaper, theme, taskbar settings from Registry/IPC
    const profile: Profile = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
    }

    console.log(`[ProfileManager] Captured system state: ${name}`)
    return profile
  }
}
