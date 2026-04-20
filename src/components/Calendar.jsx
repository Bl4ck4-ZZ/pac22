import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'

function isSatOrSun(date) {
  const d = date.getDay()
  return d === 0 || d === 6
}

function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function Calendar({ selectedDate, onSelectDate }) {
  const { t } = useLanguage()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)

  // Start grid on Monday (ISO week)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(viewYear, viewMonth, d))
  }
  while (days.length % 7 !== 0) days.push(null)

  const goPrev = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const goNext = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isPrevDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  return (
    <div className="card select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          disabled={isPrevDisabled}
          aria-label={t.prevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>
        <span className="font-semibold text-brand-text">
          {t.months[viewMonth]} {viewYear}
        </span>
        <button
          onClick={goNext}
          aria-label={t.nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {t.days.map((d, i) => (
          <div key={i} className="text-center text-xs text-brand-muted font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((date, i) => {
          if (!date) return <div key={i} />

          const isPast = date < today
          const isWeekend = isSatOrSun(date)
          const isSelectable = isWeekend && !isPast
          const dateStr = toLocalDateString(date)
          const isSelected = selectedDate === dateStr
          const isToday = toLocalDateString(date) === toLocalDateString(today)

          let cellClass =
            'relative mx-auto w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-100 '

          if (isSelected) {
            cellClass += 'bg-brand-accent text-brand-black font-bold'
          } else if (isSelectable) {
            cellClass +=
              'border border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent cursor-pointer font-medium'
          } else if (isToday) {
            cellClass += 'border border-brand-mid text-brand-mid cursor-default'
          } else {
            cellClass += 'text-brand-border cursor-default'
          }

          return (
            <div key={i} className="flex justify-center">
              <button
                disabled={!isSelectable}
                onClick={() => isSelectable && onSelectDate(dateStr)}
                aria-label={isSelectable ? `${dateStr}` : t.pastDate}
                className={cellClass}
              >
                {date.getDate()}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-accent" />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
