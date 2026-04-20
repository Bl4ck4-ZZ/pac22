import { useLanguage } from '../../hooks/useLanguage'

const STATUS_STYLES = {
  pending:   'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  confirmed: 'bg-green-900/40 text-green-300 border-green-700',
  refused:   'bg-red-900/40 text-red-300 border-red-700',
}

export default function ReservationCard({ reservation, onConfirm, onRefuse }) {
  const { t } = useLanguage()
  const r = reservation

  const formattedDate = new Date(r.date + 'T00:00:00').toLocaleDateString(
    undefined,
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )
  const formattedCreated = new Date(r.created_at).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  )

  const statusLabel = {
    pending:   t.statusPending,
    confirmed: t.statusConfirmed,
    refused:   t.statusRefused,
  }[r.status]

  return (
    <div className="card space-y-4">
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-brand-text text-lg leading-tight">
            {r.first_name} {r.last_name}
          </h3>
          <p className="text-brand-muted text-sm mt-0.5">{r.email}</p>
          <p className="text-brand-muted text-sm">{r.phone}</p>
        </div>
        <span className={`badge border text-xs ${STATUS_STYLES[r.status]}`}>
          {statusLabel}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Detail label={t.successDate} value={formattedDate} wide />
        <Detail label={t.successTime} value={r.start_time.slice(0, 5)} />
        <Detail label={t.successDuration} value={`${r.duration_hours}h`} />
        <Detail label={t.successPlayers} value={`${r.players_count} ${t.cardPlayers}`} />
      </div>

      {r.refusal_reason && (
        <div className="text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2 text-red-300">
          <span className="font-semibold">{t.cardReason}: </span>
          {r.refusal_reason}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-brand-border">
        <span className="text-xs text-brand-muted mr-auto">
          {t.cardSubmitted} {formattedCreated}
        </span>
        {r.status === 'pending' && (
          <>
            <button onClick={() => onConfirm(r)} className="btn-primary text-sm px-4 py-2">
              {t.confirmBtn}
            </button>
            <button onClick={() => onRefuse(r)} className="btn-danger text-sm px-4 py-2">
              {t.refuseBtn}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value, wide }) {
  return (
    <div className={wide ? 'col-span-2 sm:col-span-2' : ''}>
      <p className="text-brand-muted text-xs uppercase tracking-wider">{label}</p>
      <p className="text-brand-text font-medium mt-0.5">{value}</p>
    </div>
  )
}
