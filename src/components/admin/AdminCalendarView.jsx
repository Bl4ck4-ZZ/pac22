import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../hooks/useLanguage'

function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function AdminCalendarView() {
  const { t } = useLanguage()
  const today = new Date()

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [reservations, setReservations] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0)
    const from = toLocalDateString(firstDay)
    const to = toLocalDateString(lastDay)

    supabase
      .from('reservations')
      .select('*')
      .eq('status', 'confirmed')
      .gte('date', from)
      .lte('date', to)
      .order('date')
      .order('start_time')
      .then(({ data }) => setReservations(data || []))
  }, [viewYear, viewMonth])

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(viewYear, viewMonth, d))
  }
  while (days.length % 7 !== 0) days.push(null)

  const resByDate = reservations.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = []
    acc[r.date].push(r)
    return acc
  }, {})

  const goPrev = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const goNext = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const selectedReservations = selectedDate ? (resByDate[selectedDate] || []) : []

  return (
    <div className="space-y-6">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={goPrev} className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent transition-colors">‹</button>
          <span className="font-semibold text-brand-text">{t.months[viewMonth]} {viewYear}</span>
          <button onClick={goNext} className="w-9 h-9 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent transition-colors">›</button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {t.days.map((d, i) => (
            <div key={i} className="text-center text-xs text-brand-muted font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((date, i) => {
            if (!date) return <div key={i} />
            const dateStr = toLocalDateString(date)
            const count = (resByDate[dateStr] || []).length
            const isSelected = selectedDate === dateStr
            const isToday = dateStr === toLocalDateString(today)

            return (
              <div key={i} className="flex justify-center">
                <button
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative mx-auto w-10 h-10 flex flex-col items-center justify-center rounded-lg text-sm transition-colors duration-100
                    ${isSelected ? 'bg-brand-accent text-brand-black font-bold' :
                      count > 0 ? 'bg-brand-dark text-brand-text hover:bg-brand-mid cursor-pointer border border-brand-mid' :
                      isToday ? 'border border-brand-mid text-brand-mid cursor-default' :
                      'text-brand-muted cursor-default'}`}
                >
                  <span className="leading-none">{date.getDate()}</span>
                  {count > 0 && !isSelected && (
                    <span className="text-[9px] leading-none mt-0.5 text-brand-accent font-bold">{count}</span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected day reservations */}
      {selectedDate && (
        <div className="space-y-3">
          <h3 className="font-semibold text-brand-text">{selectedDate}</h3>
          {selectedReservations.length === 0
            ? <p className="text-brand-muted text-sm">{t.calNoEvents}</p>
            : selectedReservations.map(r => (
                <div key={r.id} className="card flex flex-wrap gap-4 text-sm">
                  <span className="font-semibold text-brand-text">{r.first_name} {r.last_name}</span>
                  <span className="text-brand-muted">{r.start_time.slice(0, 5)} · {r.duration_hours}h</span>
                  <span className="text-brand-muted">{r.players_count} {t.cardPlayers}</span>
                  <span className="text-brand-muted">{r.phone}</span>
                </div>
              ))
          }
        </div>
      )}

      {reservations.length === 0 && (
        <p className="text-brand-muted text-sm text-center py-4">{t.calNoEvents}</p>
      )}
    </div>
  )
}
