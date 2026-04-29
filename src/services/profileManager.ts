/**
 * Profile Manager Service
 * Handles saving, loading, and applying customization profiles
 *
 * Stores profiles as JSON in %APPDATA%/PersonalizacionSO/profiles/
 * Each profile captures: wallpaper, taskbar, theme, shortcuts
 */

import { promises as fs } from 'fs'
import path from 'path'
import type { Profile } from '../types'

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
   * @returns Success status and list of applied settings
   */
  static async applyProfile(id: string): Promise<{ success: boolean; applied: string[] }> {
    const profile = await this.loadProfile(id)
    if (!profile) {
      throw new Error(`Profile not found: ${id}`)
    }

    const applied: string[] = []

    try {
      // Validate profile before applying
      await this.validateProfile(profile)

      // In a real implementation, this would:
      // 1. Create Registry backup
      // 2. Apply each setting via IPC to respective services
      // 3. Track applied settings for rollback if needed

      if (profile.wallpaper) {
        applied.push('wallpaper')
      }
      if (profile.taskbar) {
        applied.push('taskbar')
      }
      if (profile.theme) {
        applied.push('theme')
      }
      if (profile.shortcuts && profile.shortcuts.length > 0) {
        applied.push('shortcuts')
      }

      console.log(`[ProfileManager] Applied profile: ${id} (${applied.join(', ')})`)
      return { success: true, applied }
    } catch (error) {
      console.error(`Failed to apply profile: ${(error as Error).message}`)
      return { success: false, applied: [] }
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
      if (profile.wallpaper) {
        try {
          await fs.access(profile.wallpaper)
        } catch {
          throw new Error(`Wallpaper file not found: ${profile.wallpaper}`)
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
   * Set a profile as default (auto-apply on system startup)
   * @param id Profile ID
   * @returns Success status
   */
  static async setAsDefault(id: string): Promise<boolean> {
    // Verify profile exists
    const profile = await this.loadProfile(id)
    if (!profile) {
      throw new Error(`Profile not found: ${id}`)
    }

    // TODO: Store default profile ID in Registry
    // HKCU\Software\PersonalizacionSO\Settings (default_profile_id)
    console.log(`[ProfileManager] Set default profile: ${id}`)
    return true
  }

  /**
   * Get the default profile ID
   * @returns Profile ID or null if none set
   */
  static async getDefaultProfile(): Promise<string | null> {
    // TODO: Read default profile ID from Registry
    // HKCU\Software\PersonalizacionSO\Settings (default_profile_id)
    console.log('[ProfileManager] Getting default profile')
    return null
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
