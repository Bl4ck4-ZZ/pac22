import { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

export default function RefuseModal({ reservation, onConfirm, onClose }) {
  const { t } = useLanguage()
  const [reason, setReason] = useState('')

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!reservation) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-md space-y-4 border-red-800">
        <h2 className="font-bold text-brand-text text-lg">
          {t.refuseTitle}
        </h2>
        <p className="text-sm text-brand-muted">
          {reservation.first_name} {reservation.last_name} —{' '}
          {reservation.date} à {reservation.start_time.slice(0, 5)}
        </p>
        <div>
          <label className="block text-sm text-brand-muted mb-1">
            {t.refuseReasonLabel}
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={t.refuseReasonPlaceholder}
            className="input-field resize-none"
          />
        </div>
        <div className="flex gap-3 justify-end pt-1">
          <button onClick={onClose} className="btn-secondary text-sm">
            {t.cancel}
          </button>
          <button
            onClick={() => onConfirm(reservation, reason.trim())}
            className="btn-danger text-sm"
          >
            {t.refuseConfirm}
          </button>
        </div>
      </div>
    </div>
  )
}
