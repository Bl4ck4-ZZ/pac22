import { useState } from 'react'
import Header from '../components/Header'
import Calendar from '../components/Calendar'
import TimeSlotPicker from '../components/TimeSlotPicker'
import BookingForm from '../components/BookingForm'
import SuccessScreen from '../components/SuccessScreen'
import { useLanguage } from '../hooks/useLanguage'

export default function BookingPage() {
  const { t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [booking, setBooking] = useState(null)

  const handleSuccess = (bookingData) => {
    setBooking(bookingData)
  }

  const handleReset = () => {
    setBooking(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setSelectedDuration(null)
  }

  if (booking) {
    return (
      <>
        <Header />
        <main>
          <SuccessScreen booking={booking} onReset={handleReset} />
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            {t.pageTitle}
          </h1>
          <p className="text-brand-muted mt-2 text-sm sm:text-base">
            {t.pageSubtitle}
          </p>
        </div>

        {/* Step 1 – Calendar */}
        <section>
          <SectionLabel number={1} label={t.stepDate} />
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </section>

        {/* Step 2 – Time slots */}
        {selectedDate && (
          <section>
            <SectionLabel number={2} label={t.stepSlot} />
            <TimeSlotPicker
              date={selectedDate}
              selectedSlot={selectedSlot}
              selectedDuration={selectedDuration}
              onSelectSlot={setSelectedSlot}
              onSelectDuration={setSelectedDuration}
            />
          </section>
        )}

        {/* Step 3 – Booking form */}
        {selectedDate && (
          <section>
            <SectionLabel number={3} label={t.stepForm} />
            <BookingForm
              date={selectedDate}
              startTime={selectedSlot}
              duration={selectedDuration}
              onSuccess={handleSuccess}
            />
          </section>
        )}
      </main>
    </>
  )
}

function SectionLabel({ number, label }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="w-7 h-7 rounded-full bg-brand-dark border border-brand-accent text-brand-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </span>
      <span className="text-brand-text font-semibold">{label}</span>
    </div>
  )
}
