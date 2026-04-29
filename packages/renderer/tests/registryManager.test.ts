import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RegistryManager } from '../../src/services/registryManager'

describe('RegistryManager - Taskbar Position', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTaskbarPosition', () => {
    it('should return "bottom" as default position', async () => {
      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('bottom')
    })

    it('should parse position byte from StuckRects3 binary data', async () => {
      // Mock the read method to return a hex string representing taskbar binary data
      // Byte 12 = 0 (bottom)
      const bottomBuffer = Buffer.alloc(16)
      bottomBuffer[12] = 0
      const bottomHex = bottomBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(bottomHex)

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('bottom')
    })

    it('should map position byte 1 to "top"', async () => {
      const topBuffer = Buffer.alloc(16)
      topBuffer[12] = 1
      const topHex = topBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(topHex)

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('top')
    })

    it('should map position byte 2 to "left"', async () => {
      const leftBuffer = Buffer.alloc(16)
      leftBuffer[12] = 2
      const leftHex = leftBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(leftHex)

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('left')
    })

    it('should map position byte 3 to "right"', async () => {
      const rightBuffer = Buffer.alloc(16)
      rightBuffer[12] = 3
      const rightHex = rightBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(rightHex)

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('right')
    })

    it('should return "bottom" if Registry key not found', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(null)

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('bottom')
    })

    it('should handle error and return "bottom" as fallback', async () => {
      vi.spyOn(RegistryManager, 'read').mockRejectedValueOnce(new Error('Registry access denied'))

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('bottom')
    })

    it('should handle malformed binary data (too short)', async () => {
      const shortBuffer = Buffer.alloc(5) // Too short
      const shortHex = shortBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(shortHex)

      const position = await RegistryManager.getTaskbarPosition()
      expect(position).toBe('bottom')
    })
  })

  describe('setTaskbarPosition', () => {
    it('should successfully set position to "top"', async () => {
      // Create initial buffer with position byte = 0 (bottom)
      const initialBuffer = Buffer.alloc(16)
      initialBuffer[12] = 0
      const initialHex = initialBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(initialHex)
      vi.spyOn(RegistryManager, 'write').mockResolvedValueOnce(true)
      vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValueOnce(true)

      const result = await RegistryManager.setTaskbarPosition('top')

      expect(result).toBe(true)
      expect(RegistryManager.write).toHaveBeenCalled()
    })

    it('should update position byte correctly', async () => {
      const initialBuffer = Buffer.alloc(16)
      initialBuffer[12] = 0
      const initialHex = initialBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(initialHex)
      const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValueOnce(true)
      vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValueOnce(true)

      await RegistryManager.setTaskbarPosition('left')

      // Verify write was called with modified buffer
      expect(writeSpy).toHaveBeenCalled()
      const writeCall = writeSpy.mock.calls[0]
      const writtenValue = writeCall[3] as string

      // Parse written value and verify byte 12 = 2
      const writtenBuffer = Buffer.from(writtenValue, 'hex')
      expect(writtenBuffer[12]).toBe(2) // 2 = left
    })

    it('should restart Explorer after successful write', async () => {
      const buffer = Buffer.alloc(16)
      buffer[12] = 0
      const bufferHex = buffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(bufferHex)
      vi.spyOn(RegistryManager, 'write').mockResolvedValueOnce(true)
      const restartSpy = vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValueOnce(true)

      await RegistryManager.setTaskbarPosition('right')

      expect(restartSpy).toHaveBeenCalled()
    })

    it('should return false if Registry read fails', async () => {
      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(null)

      const result = await RegistryManager.setTaskbarPosition('top')

      expect(result).toBe(false)
    })

    it('should return false if write fails', async () => {
      const buffer = Buffer.alloc(16)
      buffer[12] = 0
      const bufferHex = buffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(bufferHex)
      vi.spyOn(RegistryManager, 'write').mockResolvedValueOnce(false)

      const result = await RegistryManager.setTaskbarPosition('top')

      expect(result).toBe(false)
    })

    it('should handle error during position change', async () => {
      vi.spyOn(RegistryManager, 'read').mockRejectedValueOnce(new Error('Registry error'))

      const result = await RegistryManager.setTaskbarPosition('top')

      expect(result).toBe(false)
    })

    it('should handle malformed binary data during write', async () => {
      const shortBuffer = Buffer.alloc(5) // Too short
      const shortHex = shortBuffer.toString('hex')

      vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(shortHex)

      const result = await RegistryManager.setTaskbarPosition('top')

      expect(result).toBe(false)
    })

    it('should map all position values correctly to byte values', async () => {
      const initialBuffer = Buffer.alloc(16)
      initialBuffer[12] = 0
      const initialHex = initialBuffer.toString('hex')

      const positions: Array<['top' | 'bottom' | 'left' | 'right', number]> = [
        ['bottom', 0],
        ['top', 1],
        ['left', 2],
        ['right', 3],
      ]

      for (const [position, expectedByte] of positions) {
        vi.clearAllMocks()
        vi.spyOn(RegistryManager, 'read').mockResolvedValueOnce(initialHex)
        const writeSpy = vi.spyOn(RegistryManager, 'write').mockResolvedValueOnce(true)
        vi.spyOn(RegistryManager, 'restartExplorer').mockResolvedValueOnce(true)

        await RegistryManager.setTaskbarPosition(position)

        const writeCall = writeSpy.mock.calls[0]
        const writtenValue = writeCall[3] as string
        const writtenBuffer = Buffer.from(writtenValue, 'hex')

        expect(writtenBuffer[12]).toBe(expectedByte)
      }
    })
  })

  describe('restartExplorer', () => {
    it('should return true when called', async () => {
      const result = await RegistryManager.restartExplorer()
      expect(result).toBe(true)
    })

    it('should handle error gracefully', async () => {
      vi.spyOn(RegistryManager, 'restartExplorer').mockRejectedValueOnce(
        new Error('Explorer restart failed')
      )

      try {
        await RegistryManager.restartExplorer()
      } catch {
        // Expected to handle error
      }
    })
  })

  describe('getTaskbarProperty', () => {
    it('should call getTaskbarPosition when property is "position"', async () => {
      const positionSpy = vi.spyOn(RegistryManager, 'getTaskbarPosition').mockResolvedValueOnce('top')

      const result = await RegistryManager.getTaskbarProperty('position')

      expect(positionSpy).toHaveBeenCalled()
      expect(result).toBe('top')
    })

    it('should return null for unsupported properties', async () => {
      const result = await RegistryManager.getTaskbarProperty('unsupported')

      expect(result).toBeNull()
    })
  })

  describe('setTaskbarProperty', () => {
    it('should call setTaskbarPosition when property is "position"', async () => {
      const positionSpy = vi.spyOn(RegistryManager, 'setTaskbarPosition').mockResolvedValueOnce(true)

      const result = await RegistryManager.setTaskbarProperty('position', 'left')

      expect(positionSpy).toHaveBeenCalledWith('left')
      expect(result).toBe(true)
    })

    it('should return false for unsupported properties', async () => {
      const result = await RegistryManager.setTaskbarProperty('unsupported', 'value')

      expect(result).toBe(false)
    })

    it('should handle non-string position values gracefully', async () => {
      const result = await RegistryManager.setTaskbarProperty('position', 123)

      expect(result).toBe(false)
    })
  })
})
