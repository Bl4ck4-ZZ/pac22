import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../hooks/useLanguage'

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function rangesOverlap(aStart, aDuration, bStart, bDuration) {
  const aEnd = aStart + aDuration * 60
  const bEnd = bStart + bDuration * 60
  return aStart < bEnd && bStart < aEnd
}

export default function TimeSlotPicker({ date, selectedSlot, selectedDuration, onSelectSlot, onSelectDuration }) {
  const { t } = useLanguage()
  const [slots, setSlots] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)

  const dayOfWeek = (() => {
    if (!date) return null
    const d = new Date(date + 'T00:00:00')
    return d.getDay() === 6 ? 'saturday' : 'sunday'
  })()

  useEffect(() => {
    if (!date || !dayOfWeek) return
    setLoading(true)
    onSelectSlot(null)
    onSelectDuration(null)

    Promise.all([
      supabase
        .from('time_slots')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .order('start_time'),
      supabase
        .from('public_availability')
        .select('start_time, duration_hours, status')
        .eq('date', date),
    ]).then(([slotsRes, resRes]) => {
      setSlots(slotsRes.data || [])
      setReservations(resRes.data || [])
      setLoading(false)
    })
  }, [date])

  const isSlotBlocked = (slotTime) => {
    const slotMin = timeToMinutes(slotTime)
    return reservations.some(r =>
      rangesOverlap(slotMin, 1, timeToMinutes(r.start_time), r.duration_hours)
    )
  }

  const isDurationConflict = (duration) => {
    if (!selectedSlot) return false
    const slotMin = timeToMinutes(selectedSlot)
    return reservations.some(r =>
      rangesOverlap(slotMin, duration, timeToMinutes(r.start_time), r.duration_hours)
    )
  }

  if (!date) return null

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-5 bg-brand-border rounded w-48 mb-4" />
        <div className="flex gap-2 flex-wrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-brand-border rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="card text-brand-muted text-sm">
        {t.noSlotsDay}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Start time selection */}
      <div className="card">
        <p className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">
          {t.stepSlot}
        </p>
        <div className="flex flex-wrap gap-2">
          {slots.map(slot => {
            const blocked = isSlotBlocked(slot.start_time)
            const selected = selectedSlot === slot.start_time
            let cls = 'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-100 '
            if (blocked) {
              cls += 'bg-brand-surface border-brand-border text-brand-border cursor-not-allowed line-through'
            } else if (selected) {
              cls += 'bg-brand-accent border-brand-accent text-brand-black cursor-pointer'
            } else {
              cls += 'border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent cursor-pointer'
            }
            return (
              <button
                key={slot.id}
                disabled={blocked}
                onClick={() => { onSelectSlot(slot.start_time); onSelectDuration(null) }}
                className={cls}
                title={blocked ? t.unavailable : t.available}
              >
                {slot.start_time.slice(0, 5)}
                {blocked && <span className="ml-1 text-xs">✕</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Duration selection */}
      {selectedSlot && (
        <div className="card">
          <p className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-3">
            {t.duration}
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(d => {
              const conflict = isDurationConflict(d)
              const selected = selectedDuration === d
              let cls = 'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-100 '
              if (conflict) {
                cls += 'bg-brand-surface border-brand-border text-brand-border cursor-not-allowed'
              } else if (selected) {
                cls += 'bg-brand-accent border-brand-accent text-brand-black cursor-pointer'
              } else {
                cls += 'border-brand-border text-brand-text hover:border-brand-accent hover:text-brand-accent cursor-pointer'
              }
              return (
                <button
                  key={d}
                  disabled={conflict}
                  onClick={() => onSelectDuration(d)}
                  title={conflict ? t.durationConflict : ''}
                  className={cls}
                >
                  {t.durationOptions[d]}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
