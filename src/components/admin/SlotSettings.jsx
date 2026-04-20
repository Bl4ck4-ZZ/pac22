import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../hooks/useLanguage'

export default function SlotSettings() {
  const { t } = useLanguage()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved
  const [newTimes, setNewTimes] = useState({ saturday: '', sunday: '' })

  const fetchSlots = async () => {
    const { data } = await supabase
      .from('time_slots')
      .select('*')
      .order('day_of_week')
      .order('start_time')
    setSlots(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSlots() }, [])

  const toggle = (id) => {
    setSlots(prev =>
      prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s)
    )
  }

  const save = async () => {
    setSaveState('saving')
    const updates = slots.map(s =>
      supabase.from('time_slots').update({ is_active: s.is_active }).eq('id', s.id)
    )
    await Promise.all(updates)
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2000)
  }

  const addSlot = async (day) => {
    const time = newTimes[day]
    if (!time) return
    const formatted = time.length === 5 ? time + ':00' : time
    const { error } = await supabase
      .from('time_slots')
      .insert({ day_of_week: day, start_time: formatted, is_active: true })
    if (!error) {
      setNewTimes(n => ({ ...n, [day]: '' }))
      fetchSlots()
    }
  }

  const deleteSlot = async (id) => {
    await supabase.from('time_slots').delete().eq('id', id)
    setSlots(prev => prev.filter(s => s.id !== id))
  }

  if (loading) {
    return <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-brand-border rounded-lg" />)}</div>
  }

  const byDay = (day) => slots.filter(s => s.day_of_week === day)

  return (
    <div className="space-y-8">
      {['saturday', 'sunday'].map(day => (
        <section key={day}>
          <h3 className="font-semibold text-brand-text mb-3">
            {day === 'saturday' ? t.settingsSaturday : t.settingsSunday}
          </h3>
          <div className="space-y-2">
            {byDay(day).map(slot => (
              <div key={slot.id} className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5">
                <span className="text-brand-text font-mono text-sm w-14">
                  {slot.start_time.slice(0, 5)}
                </span>
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <div
                    onClick={() => toggle(slot.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${slot.is_active ? 'bg-brand-accent' : 'bg-brand-border'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${slot.is_active ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-sm text-brand-muted">{t.slotActive}</span>
                </label>
                <button
                  onClick={() => deleteSlot(slot.id)}
                  title={t.deleteSlot}
                  className="text-brand-border hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {/* Add slot row */}
          <div className="flex gap-2 mt-3">
            <input
              type="time"
              value={newTimes[day]}
              onChange={e => setNewTimes(n => ({ ...n, [day]: e.target.value }))}
              className="input-field w-36"
            />
            <button
              onClick={() => addSlot(day)}
              disabled={!newTimes[day]}
              className="btn-secondary text-sm px-4 disabled:opacity-40"
            >
              {t.addSlotBtn}
            </button>
          </div>
        </section>
      ))}

      <button
        onClick={save}
        disabled={saveState !== 'idle'}
        className="btn-primary"
      >
        {saveState === 'saving' ? t.saving : saveState === 'saved' ? t.saved : t.saveSlots}
      </button>
    </div>
  )
}
