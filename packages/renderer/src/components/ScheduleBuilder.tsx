import React, { useState } from 'react'
import { useWallpaperStore, type Schedule } from '../stores/wallpaperStore'
import { TimePickerWidget } from './TimePickerWidget'

/**
 * ScheduleBuilder - UI for creating and managing wallpaper schedules
 * Users can create multiple schedules where wallpapers change at specific times
 */
export const ScheduleBuilder: React.FC = () => {
  const { schedules, addSchedule, removeSchedule, updateSchedule } =
    useWallpaperStore()

  const [newScheduleTime, setNewScheduleTime] = useState('00:00')
  const [newScheduleImage, setNewScheduleImage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleAddSchedule = async () => {
    setError(null)
    setSuccessMessage(null)

    // Validation
    if (!newScheduleTime) {
      setError('Please select a time')
      return
    }

    if (!newScheduleImage) {
      setError('Please select a wallpaper image')
      return
    }

    // Check for duplicate times
    if (schedules.some((s: Schedule) => s.time === newScheduleTime)) {
      setError('A schedule for this time already exists')
      return
    }

    // Validate time format (HH:MM)
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(newScheduleTime)) {
      setError('Invalid time format')
      return
    }

    try {
      addSchedule({
        id: `schedule_${Date.now()}`,
        time: newScheduleTime,
        imagePath: newScheduleImage,
        enabled: true,
      })

      setSuccessMessage('Schedule added successfully')
      setNewScheduleTime('00:00')
      setNewScheduleImage('')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to add schedule: ${message}`)
    }
  }

  const handleRemoveSchedule = (scheduleId: string) => {
    try {
      removeSchedule(scheduleId)
      setSuccessMessage('Schedule removed')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to remove schedule: ${message}`)
    }
  }

  const handleToggleSchedule = (schedule: Schedule) => {
    try {
      updateSchedule(schedule.id, { enabled: !schedule.enabled })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to update schedule: ${message}`)
    }
  }

  const handleSelectWallpaper = () => {
    // In a real app, this would open a file dialog
    // For now, we'll create a simple input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg,.png,.bmp,.webp'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setNewScheduleImage(file.path || file.name)
      }
    }
    input.click()
  }

  // Sort schedules by time
  const sortedSchedules = [...schedules].sort((a, b) =>
    a.time.localeCompare(b.time)
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wallpaper Schedule</h2>

      {/* Create New Schedule */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Create New Schedule</h3>

        <TimePickerWidget
          value={newScheduleTime}
          onChange={setNewScheduleTime}
          label="Time (30-minute granularity)"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Wallpaper Image</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newScheduleImage}
              readOnly
              placeholder="Select an image..."
              className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
            />
            <button
              onClick={handleSelectWallpaper}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Browse
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded text-sm">
            {successMessage}
          </div>
        )}

        <button
          onClick={handleAddSchedule}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
        >
          Add Schedule
        </button>
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          Schedules ({sortedSchedules.length})
        </h3>

        {sortedSchedules.length === 0 ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded text-center text-gray-600 dark:text-gray-400">
            No schedules yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={() => handleToggleSchedule(schedule)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold">{schedule.time}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {schedule.imagePath}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSchedule(schedule.id)}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {sortedSchedules.length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded text-sm">
          ℹ️ Wallpapers will automatically transition at scheduled times. The
          system checks every minute and applies wallpapers within ±5 minutes of
          the scheduled time.
        </div>
      )}
    </div>
  )
}
