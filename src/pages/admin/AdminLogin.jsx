import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) setError(t.loginError)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-black">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-16 h-16 rounded-full bg-brand-dark border-2 border-brand-accent flex items-center justify-center">
            <span className="text-brand-accent font-extrabold text-sm tracking-widest text-center leading-tight select-none">
              PAC<br />22
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-brand-text">{t.adminTitle}</h1>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm text-brand-muted mb-1">{t.loginEmail}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-brand-muted mb-1">{t.loginPassword}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="input-field"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '…' : t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  )
}
