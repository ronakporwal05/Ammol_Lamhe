import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '@backend/firebase/firestore'
import { CalendarDays, FileText, Type, ArrowLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import NavigationBar from '@/components/NavigationBar'

const CreateEvent = () => {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [writeSlow, setWriteSlow] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setWriteSlow(false)

    const timer = setTimeout(() => {
      setWriteSlow(true)
    }, 5000)

    try {
      const eventId = await createEvent({ name, date, description })
      clearTimeout(timer)
      toast.success('Event created successfully!')
      navigate(`/admin/events/${eventId}`)
    } catch (error) {
      clearTimeout(timer)
      console.error('Error creating event:', error)
      toast.error('Failed to create event. Please try again.')
    } finally {
      clearTimeout(timer)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-body antialiased">
      <NavigationBar activeTab="dashboard" />
      <div className="flex items-center justify-center p-5 py-16">
        <div className="w-full max-w-md animate-scale-in">
          {/* Back navigation btn */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="glass-panel rounded-[2rem] border border-white/[0.08] shadow-2xl p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-heading font-extrabold text-white mb-2 tracking-tight">
                Create New Event
              </h1>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">
                Organize a new photography session for your clients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Event Name *
                </label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    id="event-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wedding of Rohit & Ritu"
                    className="input-premium pl-12 h-[52px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Event Date *
                </label>
                <div className="relative group">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-premium pl-12 h-[52px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Description
                </label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <textarea
                    id="event-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell clients about this collection..."
                    rows={3}
                    className="input-premium pl-12 resize-none h-[100px] py-3.5"
                  />
                </div>
              </div>

              <button
                id="create-event-submit"
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-6 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Create Event
                  </>
                )}
              </button>
            </form>

            {writeSlow && (
              <div className="mt-8 bg-amber-950/20 rounded-2xl border border-amber-500/20 p-5 shadow-lg animate-scale-in text-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 flex items-center justify-center gap-1.5">
                  ⚠️ Firestore Operation Stalled
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The database write is taking longer than expected. Please verify your Firestore Database is created in Test Mode inside the Firebase Console.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
