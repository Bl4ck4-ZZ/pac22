import { useLanguage } from '../hooks/useLanguage'

export default function SuccessScreen({ booking, onReset }) {
  const { t } = useLanguage()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Check icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-brand-dark border-2 border-brand-accent flex items-center justify-center">
          <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold text-brand-text mb-2">
          {t.successTitle}
        </h2>
        <p className="text-brand-muted text-sm mb-8 leading-relaxed">
          {t.successMsg}
        </p>

        {/* Summary card */}
        <div className="card text-left mb-8 space-y-3">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">
            {t.successSummary}
          </p>
          <Row label={`${booking.firstName} ${booking.lastName}`} />
          <Row label={t.successDate} value={booking.date} />
          <Row label={t.successTime} value={booking.startTime.slice(0, 5)} />
          <Row label={t.successDuration} value={t.durationOptions[booking.duration]} />
          <Row label={t.successPlayers} value={`${booking.playersCount} ${t.cardPlayers}`} />
        </div>

        <button onClick={onReset} className="btn-secondary">
          {t.newBooking}
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-brand-border pb-2 last:border-0 last:pb-0">
      <span className="text-brand-muted">{label}</span>
      {value && <span className="text-brand-text font-medium">{value}</span>}
    </div>
  )
}
