import { useLanguage } from '../../hooks/useLanguage'
import SlotSettings from '../../components/admin/SlotSettings'

export default function AdminSettings() {
  const { t } = useLanguage()
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-brand-text mb-2">{t.settingsTitle}</h1>
      <p className="text-brand-muted text-sm mb-8">{t.settingsSubtitle}</p>
      <SlotSettings />
    </div>
  )
}
