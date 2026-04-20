import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('pac22_lang')
    if (stored === 'en' || stored === 'fr') return stored
    const browser = navigator.language?.slice(0, 2)
    return browser === 'en' ? 'en' : 'fr'
  })

  const toggle = () => {
    const next = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    localStorage.setItem('pac22_lang', next)
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
