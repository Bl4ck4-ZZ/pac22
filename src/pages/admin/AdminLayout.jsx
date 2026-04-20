import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import AdminLogin from './AdminLogin'

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth()
  const { t, toggle, lang } = useLanguage()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session) return <AdminLogin />

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-dark text-brand-accent'
        : 'text-brand-muted hover:text-brand-text'
    }`

  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      {/* Top bar */}
      <header className="bg-brand-black border-b border-brand-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-accent flex items-center justify-center">
              <span className="text-brand-accent font-extrabold text-[9px] leading-tight text-center select-none">
                PAC<br />22
              </span>
            </div>
            <span className="font-bold text-brand-text hidden sm:inline">PAC 22</span>
          </div>

          {/* Nav */}
          <nav className="flex gap-1 flex-1">
            <NavLink to="/admin" end className={navLinkClass}>{t.navDashboard}</NavLink>
            <NavLink to="/admin/calendar" className={navLinkClass}>{t.navCalendar}</NavLink>
            <NavLink to="/admin/settings" className={navLinkClass}>{t.navSettings}</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="text-xs font-semibold px-2.5 py-1 rounded border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent transition-colors"
            >
              {t.langSwitch}
            </button>
            <button
              onClick={signOut}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand-border hover:border-red-700 text-brand-muted hover:text-red-400 transition-colors"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
