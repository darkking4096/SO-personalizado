import React, { useState } from 'react'

interface TimePickerWidgetProps {
  value?: string // HH:MM format
  onChange: (time: string) => void
  disabled?: boolean
  label?: string
}

/**
 * TimePickerWidget - Time input with 30-minute granularity
 * Supports 00:00 to 23:59 format with 30-minute increments
 */
export const TimePickerWidget: React.FC<TimePickerWidgetProps> = ({
  value = '00:00',
  onChange,
  disabled = false,
  label = 'Select Time',
}) => {
  const [hour, setHour] = useState<string>(() => value.split(':')[0])
  const [minute, setMinute] = useState<string>(() => value.split(':')[1] || '00')

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value
    setHour(newHour)
    onChange(`${newHour}:${minute}`)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value
    setMinute(newMinute)
    onChange(`${hour}:${newMinute}`)
  }

  // Generate hours array (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0')
  )

  // Generate minutes array with 30-minute granularity
  const minutes = ['00', '30']

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex items-center gap-2">
        <select
          value={hour}
          onChange={handleHourChange}
          disabled={disabled}
          className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-lg font-semibold">:</span>
        <select
          value={minute}
          onChange={handleMinuteChange}
          disabled={disabled}
          className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
