import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RegistryManager } from '../../src/services/registryManager'

describe('RegistryManager - Taskbar Size & Auto-Hide', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console methods to avoid test output pollution
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getTaskbarSize', () => {
    it('should return default size when not found', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue(null)
      const size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('default')
    })

    it('should map preset string "small" correctly', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue('small')
      const size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('small')
    })

    it('should map preset string "default" correctly', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue('default')
      const size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('default')
    })

    it('should map preset string "large" correctly', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue('large')
      const size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('large')
    })

    it('should map pixel values to presets', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce('32')
      let size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('small')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce('48')
      size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('default')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce('64')
      size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('large')
    })

    it('should parse custom numeric size', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue('96')
      const size = await RegistryManager.getTaskbarSize()
      expect(size).toBe(96)
    })

    it('should validate custom size boundaries', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce('10') // too small, should default
      let size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('default') // out of bounds

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce('256') // valid max
      size = await RegistryManager.getTaskbarSize()
      expect(size).toBe(256)
    })

    it('should handle errors gracefully', async () => {
      vi.spyOn(RegistryManager, 'read').mockRejectedValue(new Error('Registry error'))
      const size = await RegistryManager.getTaskbarSize()
      expect(size).toBe('default')
    })
  })

  describe('setTaskbarSize', () => {
    it('should write preset "small" as 32 pixels', async () => {
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValue(true)
      const restartSpy = vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValue(true)

      const result = await RegistryManager.setTaskbarSize('small')
      expect(result).toBe(true)
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize',
        32,
        'dword'
      )
      expect(restartSpy).toHaveBeenCalled()
    })

    it('should write preset "default" as 48 pixels', async () => {
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValue(true)
      vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValue(true)

      await RegistryManager.setTaskbarSize('default')
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize',
        48,
        'dword'
      )
    })

    it('should write preset "large" as 64 pixels', async () => {
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValue(true)
      vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValue(true)

      await RegistryManager.setTaskbarSize('large')
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize',
        64,
        'dword'
      )
    })

    it('should write custom numeric size with bounds validation', async () => {
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValue(true)
      vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValue(true)

      // Normal custom size
      await RegistryManager.setTaskbarSize(96)
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize',
        96,
        'dword'
      )

      // Size below minimum (should clamp to 16)
      await RegistryManager.setTaskbarSize(5)
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize',
        16,
        'dword'
      )

      // Size above maximum (should clamp to 256)
      await RegistryManager.setTaskbarSize(500)
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize',
        256,
        'dword'
      )
    })

    it('should return false on write failure', async () => {
      vi.spyOn(RegistryManager, 'write').mockResolvedValue(false)

      const result = await RegistryManager.setTaskbarSize('default')
      expect(result).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      vi.spyOn(RegistryManager, 'write').mockRejectedValue(new Error('Registry error'))

      const result = await RegistryManager.setTaskbarSize('large')
      expect(result).toBe(false)
    })
  })

  describe('getAutoHideStatus', () => {
    it('should return false when not found', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue(null)
      const status = await RegistryManager.getAutoHideStatus()
      expect(status).toBe(false)
    })

    it('should return true when value is 1', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue('1')
      const status = await RegistryManager.getAutoHideStatus()
      expect(status).toBe(true)
    })

    it('should return false when value is 0', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValue('0')
      const status = await RegistryManager.getAutoHideStatus()
      expect(status).toBe(false)
    })

    it('should handle numeric values', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(1)
      let status = await RegistryManager.getAutoHideStatus()
      expect(status).toBe(true)

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(0)
      status = await RegistryManager.getAutoHideStatus()
      expect(status).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      vi.spyOn(RegistryManager, 'read').mockRejectedValue(new Error('Registry error'))
      const status = await RegistryManager.getAutoHideStatus()
      expect(status).toBe(false)
    })
  })

  describe('setAutoHide', () => {
    it('should write 1 when enabling auto-hide', async () => {
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValue(true)
      const restartSpy = vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValue(true)

      const result = await RegistryManager.setAutoHide(true)
      expect(result).toBe(true)
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'AutoHide',
        1,
        'dword'
      )
      expect(restartSpy).toHaveBeenCalled()
    })

    it('should write 0 when disabling auto-hide', async () => {
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValue(true)
      vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValue(true)

      const result = await RegistryManager.setAutoHide(false)
      expect(result).toBe(true)
      expect(writeSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'AutoHide',
        0,
        'dword'
      )
    })

    it('should return false on write failure', async () => {
      vi.spyOn(RegistryManager, 'write').mockResolvedValue(false)

      const result = await RegistryManager.setAutoHide(true)
      expect(result).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      vi.spyOn(RegistryManager, 'write').mockRejectedValue(new Error('Registry error'))

      const result = await RegistryManager.setAutoHide(true)
      expect(result).toBe(false)
    })
  })

  describe('Registry paths validation', () => {
    it('should use correct registry paths for size operations', async () => {
      const readSpy = vi.spyOn(RegistryManager, 'read').mockResolvedValue(null)

      await RegistryManager.getTaskbarSize()
      expect(readSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'TaskbarSize'
      )
    })

    it('should use correct registry paths for auto-hide operations', async () => {
      const readSpy = vi.spyOn(RegistryManager, 'read').mockResolvedValue(null)

      await RegistryManager.getAutoHideStatus()
      expect(readSpy).toHaveBeenCalledWith(
        'HKEY_CURRENT_USER',
        'Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced',
        'AutoHide'
      )
    })
  })
})
