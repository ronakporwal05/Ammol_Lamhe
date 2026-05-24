import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEvent, getEventPhotos, incrementClientCount } from '@backend/firebase/firestore'
import { loadModels } from '@ai/faceRecognition/loadModels'
import { matchFaces } from '@ai/faceRecognition/matchFaces'
import SelfieUpload from '@/components/SelfieUpload'
import MatchedPhotosGallery from '@/components/MatchedPhotosGallery'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import Spinner from '@/components/Spinner'
import { AlertCircle, RefreshCw, Sparkles, Sliders, Camera } from 'lucide-react'

const ClientEventPage = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [matches, setMatches] = useState(null)
  const [error, setError] = useState('')
  const [selfieFile, setSelfieFile] = useState(null)
  const [accuracyLevel, setAccuracyLevel] = useState('balanced') // 'strict' | 'balanced' | 'flexible'

  const accuracyThresholds = {
    strict: 0.48,   // High accuracy (no false positives)
    balanced: 0.55, // Standard (perfect for general matches + profiles)
    flexible: 0.60  // High recall (finds side profiles, turned faces, gestures easily)
  }

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await getEvent(eventId)
        if (eventData) {
          setEvent(eventData)
          // Track client visit when they access the event link
          try {
            await incrementClientCount(eventId)
          } catch (err) {
            console.warn('Failed to track client visit:', err)
          }
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('Error loading event:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadEvent()

    // Pre-load face recognition models in background
    loadModels().catch((err) => console.warn('Pre-loading models failed:', err))
  }, [eventId])

  const runMatching = async (fileToMatch, level) => {
    setProcessing(true)
    setError('')
    setMatches(null)

    const threshold = accuracyThresholds[level]

    try {
      // Step 1: Load models
      setProgress('Synchronizing matching engines...')
      await loadModels()

      // Step 2: Get event photos
      setProgress('Loading event photos...')
      const photos = await getEventPhotos(eventId)

      if (photos.length === 0) {
        setError('No photos have been uploaded for this event yet.')
        setProcessing(false)
        return
      }

      // Step 3: Match faces with dynamic threshold
      setProgress(`Scanning ${photos.length} photos...`)
      const matchedPhotos = await matchFaces(fileToMatch, photos, threshold, (current, total) => {
        setProgress(`Scanning photo ${current} of ${total}...`)
      })

      setMatches(matchedPhotos)
    } catch (err) {
      console.error('Face matching error:', err)
      if (err.message === 'NO_FACE_IN_SELFIE') {
        setError(
          'No face detected in your selfie. Please try a well-lit front-facing portrait photo.'
        )
      } else {
        setError('Scanning failed. Please choose another portrait and retry.')
      }
    } finally {
      setProcessing(false)
      setProgress('')
    }
  }

  const handleSelfieUpload = async (file) => {
    setSelfieFile(file)
    await runMatching(file, accuracyLevel)
  }

  const handleAccuracyChange = async (newLevel) => {
    setAccuracyLevel(newLevel)
    if (selfieFile) {
      await runMatching(selfieFile, newLevel)
    }
  }

  const handleRetry = () => {
    setMatches(null)
    setSelfieFile(null)
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Spinner text="Synchronizing matching engines..." size="lg" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-5 font-body">
        <div className="glass-panel rounded-[2rem] border border-white/[0.08] p-8 text-center max-w-sm shadow-2xl animate-scale-in">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <h1 className="text-base font-heading font-bold text-white mb-1">
            Event Collection Not Found
          </h1>
          <p className="text-slate-400 text-xs leading-relaxed font-normal">
            The collection link is inactive, broken, or has been archived by the administrator.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] font-body antialiased flex flex-col justify-between text-slate-300">
      {/* Sticky top mini-bar */}
      <header className="bg-slate-950/70 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20 flex justify-between items-center h-[72px]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-heading font-extrabold tracking-[0.2em] uppercase text-white">
              ANMOL LAMHE
            </span>
          </Link>
        </div>
      </header>

      {/* Main client workspace container */}
      <main className="max-w-3xl w-full mx-auto px-5 py-12 flex-grow flex flex-col justify-center">
        {/* Center Event Header */}
        <div className="text-center mb-10 max-w-lg mx-auto animate-scale-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-400 mb-4 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Smart Event Gallery Matcher
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
            {event?.name}
          </h1>
          {event?.date && (
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2.5">
              Event Date: {event.date}
            </p>
          )}
          {event?.description && (
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-sm mx-auto font-normal">
              {event.description}
            </p>
          )}
        </div>

        {/* Dynamic AI Match Precision Control Widget */}
        {selfieFile && !processing && (
          <div className="bg-slate-900/40 border border-white/[0.08] p-4 rounded-2xl mb-6 max-w-md mx-auto shadow-2xl text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center justify-center sm:justify-start gap-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  Match Strictness
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  Tweak matching sensitivity dynamically.
                </p>
              </div>

              {/* Strictness Control Bar */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/[0.08] shadow-inner">
                {['strict', 'balanced', 'flexible'].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleAccuracyChange(level)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      accuracyLevel === level
                        ? 'bg-slate-900 text-indigo-400 shadow-sm border border-white/[0.08] scale-105'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Flow Viewport */}
        {matches === null && !error ? (
          <div className="max-w-sm w-full mx-auto animate-scale-in">
            <SelfieUpload
              onUpload={handleSelfieUpload}
              processing={processing}
              progress={progress}
            />
          </div>
        ) : error ? (
          <div className="max-w-sm w-full mx-auto">
            <div className="glass-panel rounded-3xl border border-white/[0.08] p-8 text-center shadow-2xl animate-scale-in">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                No Faces Scanned
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">{error}</p>
              <button
                onClick={handleRetry}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-indigo-600 rounded-full transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border border-white/[0.08] hover:border-indigo-500/30"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Another Selfie
              </button>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="max-w-sm w-full mx-auto">
            <div className="glass-panel rounded-3xl border border-white/[0.08] p-8 text-center shadow-2xl animate-scale-in">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                No Match Results
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                We scanned all {event?.photoCount || 0} photos, but found no matching facial signatures. Try uploading a clearer, direct selfie.
              </p>
              <button
                onClick={handleRetry}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-indigo-600 rounded-full transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border border-white/[0.08] hover:border-indigo-500/30"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Another Selfie
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-scale-in">
            <MatchedPhotosGallery matches={matches} eventTitle={event?.name} totalEventPhotos={event?.photoCount || 0} onRetry={handleRetry} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-slate-950/20 py-6 text-center shrink-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          Powered by Anmol Lamhe Smart Photo Delivery
        </p>
      </footer>
    </div>
  )
}

export default ClientEventPage
