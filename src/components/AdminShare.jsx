import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getEvent, subscribeToPhotos } from '@/firebase/firestore'
import { CheckCircle, Check, Copy, Download, MessageSquare, ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react'
import Spinner from '@/components/Spinner'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const AdminShare = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await getEvent(eventId)
        if (eventData) {
          setEvent(eventData)
        } else {
          toast.error('Event not found')
          navigate('/admin/dashboard')
        }
      } catch (error) {
        console.error('Error loading event:', error)
        toast.error('Failed to load event details')
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [eventId, navigate])

  useEffect(() => {
    if (!eventId) return
    const unsubscribe = subscribeToPhotos(eventId, (photoList) => {
      setPhotos(photoList)
    })
    return () => unsubscribe()
  }, [eventId])

  const eventUrl = `${window.location.origin}/event/${eventId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(eventUrl)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `anmol-lamhe-qr-${event?.name?.replace(/\s+/g, '-') || 'event'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('QR Code downloaded successfully!')
    } catch (err) {
      console.error('QR download error:', err)
      toast.error('Failed to download QR code')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Spinner text="Preparing share dashboard..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col font-body antialiased justify-between">
      <NavigationBar activeTab="dashboard" />

      <main className="flex-grow py-12 px-5 sm:px-10 lg:px-20 max-w-[1200px] mx-auto w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-2 tracking-tight">Ready to Share!</h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium">Your event is live and photos are processed. Share the link below with your clients.</p>
        </div>

        {/* Share Card Container */}
        <div className="glass-panel rounded-[2.5rem] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col md:flex-row bg-slate-900/20">
          {/* Link & Options Column */}
          <div className="p-8 md:p-12 flex-1 border-b md:border-b-0 md:border-r border-white/[0.06]">
            {/* Event Details */}
            <div className="mb-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Event Details</span>
              <h2 className="text-2xl font-heading font-bold text-white truncate">{event?.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {event?.date || 'June 15, 2026'}
                </span>
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  {photos.length} Photos Uploaded
                </span>
              </div>
            </div>

            {/* Share Link Box */}
            <div className="mb-10">
              <label className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-widest">Direct Access Link</label>
              <div className="flex items-center p-1.5 bg-slate-950 border border-white/[0.08] rounded-2xl group focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                <input
                  type="text"
                  readOnly
                  value={eventUrl}
                  className="flex-1 bg-transparent px-4 py-2 text-slate-300 font-medium text-sm focus:outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className="h-10 px-6 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social Share Icons */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-4 uppercase tracking-widest">Quick Share via</label>
              <div className="grid grid-cols-3 gap-4">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my photos from Anmol Lamhe: ${eventUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 border border-white/[0.08] rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 hover:border-white/[0.15] hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                >
                  <svg className="w-7 h-7 text-emerald-500 mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.02-5.11-2.881-6.973-1.861-1.863-4.34-2.887-6.979-2.889-5.441 0-9.867 4.42-9.871 9.86-.001 1.696.442 3.353 1.284 4.808l-.969 3.541 3.632-.952z"/>
                  </svg>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">WhatsApp</span>
                </a>

                {/* Messenger */}
                <a
                  href={`fb-messenger://share/?link=${encodeURIComponent(eventUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 border border-white/[0.08] rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 hover:border-white/[0.15] hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                >
                  <svg className="w-7 h-7 text-[#0084FF] mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.74 6.62 4.47 8.56v4.33l4.07-2.23c1.07.3 2.2.46 3.46.46 6.63 0 12-4.97 12-11.11C24 4.97 18.63 0 12 0zm1.32 14.88l-3.08-3.28-6.02 3.28 6.62-7.03 3.14 3.28 5.96-3.28-6.62 7.03z"/>
                  </svg>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">Messenger</span>
                </a>

                {/* SMS */}
                <a
                  href={`sms:?body=Check%20out%20your%20Anmol%20Lamhe%20photos:%20${eventUrl}`}
                  className="flex flex-col items-center justify-center p-4 border border-white/[0.08] rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 hover:border-white/[0.15] hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                >
                  <MessageSquare className="w-7 h-7 text-indigo-400 mb-2 group-hover:text-indigo-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">SMS</span>
                </a>
              </div>
            </div>
          </div>

          {/* QR Code Column */}
          <div
            className="w-full md:w-80 p-10 flex flex-col items-center justify-center text-center shrink-0 border-t md:border-t-0 md:border-l border-white/[0.06] bg-slate-950/40"
          >
            <div className="p-6 bg-white rounded-3xl shadow-2xl mb-6">
              <img
                src={qrCodeUrl}
                alt="Event QR Code"
                className="w-40 h-40 object-contain"
              />
            </div>
            <h3 className="text-white font-heading font-bold text-lg mb-2">Scan to Preview</h3>
            <p className="text-slate-400 text-xs mb-6 font-normal max-w-[220px]">
              Download this QR code to print on your business cards or signage.
            </p>
            <button
              onClick={handleDownloadQR}
              className="btn-secondary py-3 px-6 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex gap-4 w-full sm:w-auto">
            <Link
              to={`/event/${eventId}`}
              target="_blank"
              className="flex-1 sm:flex-none btn-primary py-3 px-8 text-xs uppercase tracking-wider cursor-pointer active:scale-95 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-none hover:shadow-lg hover:shadow-indigo-500/20 text-center"
            >
              Preview Event
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AdminShare
