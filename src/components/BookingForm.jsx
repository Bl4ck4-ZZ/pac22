import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../hooks/useLanguage'

function validate(fields, t) {
  const errors = {}
  if (!fields.firstName.trim()) errors.firstName = t.required
  if (!fields.lastName.trim()) errors.lastName = t.required
  if (!fields.phone.trim()) errors.phone = t.required
  else if (!/^[+\d][\d\s\-().]{5,19}$/.test(fields.phone.trim())) errors.phone = t.phoneInvalid
  if (!fields.email.trim()) errors.email = t.required
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = t.emailInvalid
  const p = parseInt(fields.playersCount, 10)
  if (!fields.playersCount) errors.playersCount = t.required
  else if (isNaN(p) || p < 2) errors.playersCount = t.playersMin
  else if (p > 30) errors.playersCount = t.playersMax
  return errors
}

export default function BookingForm({ date, startTime, duration, onSuccess }) {
  const { t } = useLanguage()
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    playersCount: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(fields, t)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    setServerError('')

    // Check availability one more time before inserting
    const { data: existing } = await supabase
      .from('public_availability')
      .select('start_time, duration_hours')
      .eq('date', date)

    const timeToMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
    const newStart = timeToMin(startTime)
    const newEnd = newStart + duration * 60

    const conflict = (existing || []).some(r => {
      const rStart = timeToMin(r.start_time)
      const rEnd = rStart + r.duration_hours * 60
      return newStart < rEnd && rStart < newEnd
    })

    if (conflict) {
      setServerError(t.slotTaken)
      setSubmitting(false)
      return
    }

    const { error } = await supabase.from('reservations').insert({
      first_name: fields.firstName.trim(),
      last_name: fields.lastName.trim(),
      phone: fields.phone.trim(),
      email: fields.email.trim(),
      players_count: parseInt(fields.playersCount, 10),
      date,
      start_time: startTime,
      duration_hours: duration,
      status: 'pending',
    })

    if (error) {
      setServerError(t.genericError)
      setSubmitting(false)
      return
    }

    onSuccess({
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      date,
      startTime,
      duration,
      playersCount: parseInt(fields.playersCount, 10),
    })
  }

  if (!date || !startTime || !duration) {
    return (
      <div className="card text-brand-muted text-sm">
        {t.selectSlotFirst}
      </div>
    )
  }

  return (
    <div className="card">
      <p className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
        {t.stepForm}
      </p>

      {/* Selected booking summary */}
      <div className="bg-brand-surface rounded-lg px-4 py-3 mb-5 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-brand-muted">{t.successDate}: <span className="text-brand-accent font-semibold">{date}</span></span>
        <span className="text-brand-muted">{t.successTime}: <span className="text-brand-accent font-semibold">{startTime.slice(0, 5)}</span></span>
        <span className="text-brand-muted">{t.successDuration}: <span className="text-brand-accent font-semibold">{t.durationOptions[duration]}</span></span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-brand-muted mb-1">{t.firstName}</label>
            <input
              type="text"
              value={fields.firstName}
              onChange={set('firstName')}
              autoComplete="given-name"
              className="input-field"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm text-brand-muted mb-1">{t.lastName}</label>
            <input
              type="text"
              value={fields.lastName}
              onChange={set('lastName')}
              autoComplete="family-name"
              className="input-field"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-brand-muted mb-1">{t.phone}</label>
            <input
              type="tel"
              value={fields.phone}
              onChange={set('phone')}
              autoComplete="tel"
              className="input-field"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm text-brand-muted mb-1">{t.email}</label>
            <input
              type="email"
              value={fields.email}
              onChange={set('email')}
              autoComplete="email"
              className="input-field"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div className="sm:w-48">
          <label className="block text-sm text-brand-muted mb-1">{t.playersCount}</label>
          <input
            type="number"
            min={2}
            max={30}
            value={fields.playersCount}
            onChange={set('playersCount')}
            placeholder="2 – 30"
            className="input-field"
          />
          {errors.playersCount
            ? <p className="mt-1 text-xs text-red-400">{errors.playersCount}</p>
            : <p className="mt-1 text-xs text-brand-muted">{t.playersHint}</p>
          }
        </div>

        {serverError && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full sm:w-auto mt-2"
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  )
}
