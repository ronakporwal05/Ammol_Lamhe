import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { subscribeToEvents } from '@/firebase/firestore'
import { CalendarDays, Image, Users, Plus, Camera, Music, Upload, Share2, ChevronRight } from 'lucide-react'
import Spinner from '@/components/Spinner'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalEvents: 0, totalPhotos: 0, totalClients: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (eventList) => {
        setEvents(eventList)
        const totalPhotos = eventList.reduce((sum, e) => sum + (e.photoCount || 0), 0)
        const totalClients = eventList.reduce((sum, e) => sum + (e.clientCount || 0), 0)
        setStats({
          totalEvents: eventList.length,
          totalPhotos,
          totalClients,
        })
        setLoading(false)
      },
      (error) => {
        console.error('Dashboard events error:', error)
        toast.error('Failed to load dashboard data')
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6">
        <Spinner text="Loading your dashboard..." size="lg" />
      </div>
    )
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-body antialiased flex flex-col justify-between">
      <NavigationBar activeTab="dashboard" />
      
      {/* Main Container */}
      <main className="flex-1 py-12 px-5 sm:px-10 lg:px-20 max-w-[1200px] mx-auto w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-2 tracking-tight">
              Welcome, Photographer Admin 👋
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Manage your events and photos from your workspace dashboard.
            </p>
          </div>
          <Link
            to="/admin/create-event"
            id="dashboard-create-event-btn"
            className="btn-primary shrink-0 text-xs tracking-wider"
          >
            <Plus className="w-4.5 h-4.5" />
            Create New Event
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Total Events */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-8 rounded-[2rem] text-white border border-white/[0.08] flex flex-col justify-between relative overflow-hidden min-h-[160px] shadow-lg shadow-indigo-500/5">
            <CalendarDays className="text-white/[0.03] w-24 h-24 absolute -right-4 -bottom-4 pointer-events-none" />
            <div className="relative z-10">
              <span className="text-indigo-400 uppercase tracking-widest text-xs font-extrabold">Total Events</span>
              <div className="text-5xl font-extrabold mt-2 font-heading tracking-tight">{formatNumber(stats.totalEvents)}</div>
            </div>
          </div>

          {/* Total Photos */}
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/5 p-8 rounded-[2rem] text-white border border-white/[0.08] flex flex-col justify-between relative overflow-hidden min-h-[160px] shadow-lg shadow-pink-500/5">
            <Image className="text-white/[0.03] w-24 h-24 absolute -right-4 -bottom-4 pointer-events-none" />
            <div className="relative z-10">
              <span className="text-pink-400 uppercase tracking-widest text-xs font-extrabold">Total Photos</span>
              <div className="text-5xl font-extrabold mt-2 font-heading tracking-tight">{formatNumber(stats.totalPhotos)}</div>
            </div>
          </div>

          {/* Total Clients */}
          <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/5 p-8 rounded-[2rem] text-white border border-white/[0.08] flex flex-col justify-between relative overflow-hidden min-h-[160px] shadow-lg shadow-sky-500/5">
            <Users className="text-white/[0.03] w-24 h-24 absolute -right-4 -bottom-4 pointer-events-none" />
            <div className="relative z-10">
              <span className="text-sky-400 uppercase tracking-widest text-xs font-extrabold">Total Clients</span>
              <div className="text-5xl font-extrabold mt-2 font-heading tracking-tight">{formatNumber(stats.totalClients)}</div>
            </div>
          </div>
        </div>

        {/* Recent Events Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white font-heading">Recent Events</h2>
            <Link
              to="/admin/events"
              id="view-all-events"
              className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              View All Events
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 5).map((event) => {
              const isWedding = event.name?.toLowerCase().includes('wedding') || event.name?.toLowerCase().includes('love')
              const CardIcon = isWedding ? Camera : Music

              return (
                <div
                  key={event.id}
                  className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-[260px] group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-900/80 border border-white/[0.08] rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                        <CardIcon className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        event.photoCount > 0 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {event.photoCount > 0 ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white mb-2 truncate group-hover:text-indigo-400 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-slate-400 text-xs mb-6 line-clamp-2 leading-relaxed font-normal">
                      {event.description || 'No description added yet.'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-slate-500" />
                        {event.date || '2026-06-15'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Image className="w-4 h-4 text-slate-500" />
                        {event.photoCount || 0} Photos
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/admin/events/${event.id}`}
                        id={`event-${event.id}-upload`}
                        className="btn-secondary py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-slate-400" />
                        Upload
                      </Link>
                      <Link
                        to={`/admin/share/${event.id}`}
                        id={`event-${event.id}-share`}
                        className="btn-primary py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-none hover:shadow-lg hover:shadow-indigo-500/20"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Dotted "Start a new event" Card */}
            <Link
              to="/admin/create-event"
              id="add-more-event-card"
              className="border-2 border-dashed border-white/[0.08] hover:border-indigo-500/50 hover:bg-slate-900/10 rounded-[1.25rem] p-6 flex flex-col items-center justify-center text-center gap-4 group transition-all min-h-[260px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-white/[0.08] flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all shadow-inner">
                <Plus className="w-7 h-7" />
              </div>
              <div>
                <p className="font-heading font-extrabold text-white text-sm uppercase tracking-wider mb-1">
                  Start a new event
                </p>
                <p className="text-slate-500 text-xs">
                  Create a new link for your clients
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard
