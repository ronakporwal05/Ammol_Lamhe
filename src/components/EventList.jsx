import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subscribeToEvents, deleteEvent } from '@/firebase/firestore'
import { CalendarDays, Image, Copy, Check, Trash2, Plus, Search, ExternalLink, ArrowLeft } from 'lucide-react'
import Spinner from '@/components/Spinner'
import NavigationBar from '@/components/NavigationBar'
import toast from 'react-hot-toast'

const EventList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (eventList) => {
        setEvents(eventList)
        setLoading(false)
      },
      (error) => {
        console.error('Events list error:', error)
        toast.error('Failed to load events')
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const handleCopyLink = (eventId) => {
    const link = `${window.location.origin}/event/${eventId}`
    navigator.clipboard.writeText(link)
    setCopiedId(eventId)
    toast.success('Event link copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (eventId, eventName) => {
    if (!window.confirm(`Delete "${eventName}"? This cannot be undone.`)) return

    try {
      await deleteEvent(eventId)
      toast.success('Event deleted')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete event')
    }
  }

  const filteredEvents = events.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Spinner text="Loading events..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-body antialiased flex flex-col justify-between">
      <NavigationBar activeTab="dashboard" />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-5 sm:px-10 lg:px-20 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-heading font-extrabold text-white">All Events</h1>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
              {events.length} photography sessions active
            </p>
          </div>
          <Link
            to="/admin/create-event"
            className="btn-primary text-xs tracking-wider"
          >
            <Plus className="w-5 h-5" /> Create Event
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            id="search-events"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title..."
            className="input-premium pl-12 h-[52px]"
          />
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border-white/[0.08] max-w-md mx-auto">
            <CalendarDays className="w-10 h-10 text-slate-500 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-1">
              {search ? 'No matches found' : 'No events yet'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {search ? 'Try adjusting your search criteria.' : 'Create your first event to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="glass-card glass-card-hover p-0 border border-white/[0.06] flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <Link to={`/admin/events/${event.id}`}>
                    <h3 className="font-heading font-bold text-white hover:text-indigo-400 transition-colors truncate text-base">
                      {event.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                    {event.description || 'No description added.'}
                  </p>

                  <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-slate-500" />
                      {event.date || 'No Date'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-slate-500" />
                      {event.photoCount || 0} Photos
                    </span>
                  </div>
                </div>

                {/* Custom slate action tray */}
                <div className="flex items-center justify-between p-4 bg-slate-900/40 border-t border-white/[0.06]">
                  <Link
                    to={`/admin/events/${event.id}`}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-950 border border-white/[0.08] hover:border-white/[0.15] rounded-full transition-all"
                  >
                    Manage
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(event.id)}
                      className="p-2 bg-slate-950 border border-white/[0.08] hover:border-indigo-500/30 rounded-full text-slate-400 hover:text-indigo-400 transition-all cursor-pointer shadow-inner"
                      title="Copy event link"
                    >
                      {copiedId === event.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`/event/${event.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-950 border border-white/[0.08] hover:border-indigo-500/30 rounded-full text-slate-400 hover:text-indigo-400 transition-all shadow-inner"
                      title="Open client matching page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(event.id, event.name)}
                      className="p-2 bg-slate-950 border border-white/[0.08] hover:border-red-500/30 rounded-full text-slate-400 hover:text-red-400 transition-all cursor-pointer shadow-inner"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default EventList
