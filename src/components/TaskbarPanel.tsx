import React, { useCallback, useEffect } from 'react'
import { useTaskbarStore } from '../stores/taskbarStore'
import { PositionSelector } from './PositionSelector'

export const TaskbarPanel: React.FC = () => {
  const {
    position,
    transparency,
    size,
    visibility,
    autoHide,
    isApplying,
    error,
    setPosition,
    setTransparency,
    setSize,
    setVisibility,
    setAutoHide,
    setIsApplying,
    setError,
  } = useTaskbarStore()

  // Load current taskbar position from Registry on mount
  useEffect(() => {
    const loadCurrentPosition = async () => {
      try {
        // This would load from Registry in production
        // For now, the default is set in the store
        console.log('[TaskbarPanel] Current position:', position)
      } catch (err) {
        console.error('[TaskbarPanel] Error loading current position:', err)
      }
    }

    loadCurrentPosition()
  }, [position])

  /**
   * Handle position change
   */
  const handlePositionChange = useCallback(
    async (newPosition: 'top' | 'bottom' | 'left' | 'right') => {
      try {
        setError(null)
        setIsApplying(true)

        // Update store immediately for responsive UI
        setPosition(newPosition)

        // In production, this would call the Registry write via IPC
        // const result = await ipcRenderer.invoke('set-taskbar-position', { position: newPosition })
        // if (!result.success) {
        //   setError(result.error || 'Failed to apply taskbar position')
        //   setPosition(position) // Revert on error
        // }

        console.log('[TaskbarPanel] Applied position:', newPosition)
      } catch (err) {
        setError('Failed to apply taskbar position')
        setPosition(position) // Revert on error
      } finally {
        setIsApplying(false)
      }
    },
    [position, setPosition, setIsApplying, setError]
  )

  /**
   * Handle transparency toggle
   */
  const handleTransparencyChange = useCallback(
    (newTransparency: boolean) => {
      try {
        setError(null)
        setTransparency(newTransparency)
        console.log('[TaskbarPanel] Applied transparency:', newTransparency)
      } catch (err) {
        setError('Failed to apply transparency setting')
      }
    },
    [setTransparency, setError]
  )

  /**
   * Handle size change
   */
  const handleSizeChange = useCallback(
    (newSize: 'small' | 'medium' | 'large') => {
      try {
        setError(null)
        setSize(newSize)
        console.log('[TaskbarPanel] Applied size:', newSize)
      } catch (err) {
        setError('Failed to apply size setting')
      }
    },
    [setSize, setError]
  )

  /**
   * Handle visibility toggle
   */
  const handleVisibilityChange = useCallback(
    (newVisibility: boolean) => {
      try {
        setError(null)
        setVisibility(newVisibility)
        console.log('[TaskbarPanel] Applied visibility:', newVisibility)
      } catch (err) {
        setError('Failed to apply visibility setting')
      }
    },
    [setVisibility, setError]
  )

  /**
   * Handle auto-hide toggle
   */
  const handleAutoHideChange = useCallback(
    (newAutoHide: boolean) => {
      try {
        setError(null)
        setAutoHide(newAutoHide)
        console.log('[TaskbarPanel] Applied auto-hide:', newAutoHide)
      } catch (err) {
        setError('Failed to apply auto-hide setting')
      }
    },
    [setAutoHide, setError]
  )

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Taskbar Settings</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Position Control Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <PositionSelector
          currentPosition={position}
          onPositionChange={handlePositionChange}
          disabled={isApplying}
        />
      </div>

      {/* Size Control Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Taskbar Size
        </label>
        <div className="flex gap-3">
          {(['small', 'medium', 'large'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleSizeChange(s)}
              disabled={isApplying}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                size === s
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              } ${isApplying ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transparency Toggle Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={transparency}
            onChange={(e) => handleTransparencyChange(e.target.checked)}
            disabled={isApplying}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Enable Taskbar Transparency
          </span>
        </label>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Makes the taskbar semi-transparent to see content behind it
        </p>
      </div>

      {/* Visibility Toggle Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={visibility}
            onChange={(e) => handleVisibilityChange(e.target.checked)}
            disabled={isApplying}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Show Taskbar
          </span>
        </label>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Show or hide the taskbar from your desktop
        </p>
      </div>

      {/* Auto-Hide Toggle Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoHide}
            onChange={(e) => handleAutoHideChange(e.target.checked)}
            disabled={isApplying}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Auto-Hide Taskbar
          </span>
        </label>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Automatically hide taskbar when not in use, move mouse to bottom to show
        </p>
      </div>

      {/* Status Message */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm">
        {isApplying ? (
          '⏳ Applying taskbar settings...'
        ) : (
          <>
            ℹ️ Taskbar position: <strong>{position.toUpperCase()}</strong> | Apply time: &lt;500ms
          </>
        )}
      </div>
    </div>
  )
}
