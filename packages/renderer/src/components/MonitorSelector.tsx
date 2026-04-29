import React, { useEffect } from 'react'
import { useWallpaperStore, Monitor } from '../stores/wallpaperStore'
import { WallpaperService } from '../services/wallpaperService'

export const MonitorSelector: React.FC = () => {
  const {
    availableMonitors,
    selectedMonitor,
    setAvailableMonitors,
    setSelectedMonitor,
    setError,
  } = useWallpaperStore()

  useEffect(() => {
    const loadMonitors = async () => {
      try {
        const result = await WallpaperService.getGlobalInstance().getAvailableMonitors()
        if (result.success && result.monitors) {
          setAvailableMonitors(result.monitors)
        } else if (result.error) {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to load monitors')
      }
    }

    loadMonitors()
  }, [setAvailableMonitors, setError])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonitor(e.target.value)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="monitor-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Apply to Monitor
      </label>
      <select
        id="monitor-select"
        value={selectedMonitor}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="all">All Monitors</option>
        {availableMonitors.map((monitor: Monitor) => (
          <option key={monitor.id} value={monitor.id}>
            {monitor.name} {monitor.primary ? '(Primary)' : ''}
          </option>
        ))}
      </select>
    </div>
  )
}
