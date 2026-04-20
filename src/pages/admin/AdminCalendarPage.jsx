import { useLanguage } from '../../hooks/useLanguage'
import AdminCalendarView from '../../components/admin/AdminCalendarView'

export default function AdminCalendarPage() {
  const { t } = useLanguage()
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-brand-text mb-6">{t.calTitle}</h1>
      <AdminCalendarView />
    </div>
  )
}
