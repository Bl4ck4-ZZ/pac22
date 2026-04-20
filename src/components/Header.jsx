import { useLanguage } from '../hooks/useLanguage'

export default function Header() {
  const { lang, toggle, t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-brand-black/90 backdrop-blur border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + club name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-dark border-2 border-brand-accent flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-brand-accent font-extrabold text-xs tracking-widest select-none">
              PAC<br />22
            </span>
          </div>
          <div>
            <span className="text-brand-text font-extrabold text-xl tracking-tight leading-none">
              PAC 22
            </span>
            <p className="text-brand-muted text-xs mt-0.5">{t.tagline}</p>
          </div>
        </div>

        {/* Language switcher */}
        <button
          onClick={toggle}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
        >
          {t.langSwitch}
        </button>
      </div>
    </header>
  )
}
