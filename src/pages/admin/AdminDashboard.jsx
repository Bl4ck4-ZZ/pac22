import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../hooks/useLanguage'
import ReservationCard from '../../components/admin/ReservationCard'
import RefuseModal from '../../components/admin/RefuseModal'

const STATUSES = ['pending', 'confirmed', 'refused']

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [toRefuse, setToRefuse] = useState(null)

  const fetchReservations = useCallback(async () => {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })
    setReservations(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('reservations-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchReservations])

  const confirm = async (r) => {
    await supabase.from('reservations').update({ status: 'confirmed' }).eq('id', r.id)
    fetchReservations()
  }

  const refuse = async (r, reason) => {
    await supabase
      .from('reservations')
      .update({ status: 'refused', refusal_reason: reason || null })
      .eq('id', r.id)
    setToRefuse(null)
    fetchReservations()
  }

  const byStatus = (status) => reservations.filter(r => r.status === status)

  const statusLabel = {
    pending:   t.statusPending,
    confirmed: t.statusConfirmed,
    refused:   t.statusRefused,
  }

  const tabColor = {
    pending:   'bg-yellow-900/40 text-yellow-300 border-yellow-700',
    confirmed: 'bg-green-900/40 text-green-300 border-green-700',
    refused:   'bg-red-900/40 text-red-300 border-red-700',
  }

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-brand-border rounded-xl" />)}
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-brand-text mb-6">{t.dashTitle}</h1>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(status => {
          const count = byStatus(status).length
          const isActive = activeTab === status
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors
                ${isActive ? tabColor[status] : 'border-brand-border text-brand-muted hover:border-brand-accent hover:text-brand-text'}`}
            >
              {statusLabel[status]}
              <span className={`badge ${isActive ? '' : 'bg-brand-surface text-brand-muted border border-brand-border'} ${isActive ? tabColor[status] : ''} border`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Reservation list */}
      <div className="space-y-4">
        {byStatus(activeTab).length === 0
          ? <p className="text-brand-muted text-sm py-8 text-center">{t.noReservations}</p>
          : byStatus(activeTab).map(r => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onConfirm={confirm}
                onRefuse={setToRefuse}
              />
            ))
        }
      </div>

      <RefuseModal
        reservation={toRefuse}
        onConfirm={refuse}
        onClose={() => setToRefuse(null)}
      />
    </>
  )
}
