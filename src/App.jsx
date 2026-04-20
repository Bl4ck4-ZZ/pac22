import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage'
import { AuthProvider } from './hooks/useAuth'
import BookingPage from './pages/BookingPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCalendarPage from './pages/admin/AdminCalendarPage'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public booking page */}
            <Route path="/" element={<BookingPage />} />

            {/* Admin panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="calendar" element={<AdminCalendarPage />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}
