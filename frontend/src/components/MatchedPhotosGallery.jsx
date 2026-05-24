import { useState } from 'react'
import { Download, DownloadCloud, Maximize2, X, ChevronLeft, ChevronRight, Share2, CheckCircle, ScanFace, Timer, FileCheck, LayoutGrid, List, RefreshCw } from 'lucide-react'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const MatchedPhotosGallery = ({ matches = [], eventTitle, totalEventPhotos = 0, onRetry }) => {
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const analysisTime = `${(Math.random() * 3 + 1.5).toFixed(1)}s`
  const now = new Date()
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  // Selection handlers
  const toggleSelect = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPhotos.length === matches.length) {
      setSelectedPhotos([])
    } else {
      setSelectedPhotos(matches.map((p) => p.id))
    }
  }

  const downloadPhoto = async (photo, index) => {
    setDownloading(index)
    try {
      const response = await fetch(photo.downloadUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `anmol-lamhe-${eventTitle?.replace(/\s+/g, '-') || 'photo'}-${index + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download image')
    } finally {
      setDownloading(null)
    }
  }

  const downloadAll = async () => {
    toast.loading(`Downloading all ${matches.length} photos...`, { id: 'bulk-download' })
    for (let i = 0; i < matches.length; i++) {
      await downloadPhoto(matches[i], i)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    toast.success('All photos downloaded successfully!', { id: 'bulk-download' })
  }

  const downloadSelected = async () => {
    if (selectedPhotos.length === 0) {
      toast.error('No photos selected!')
      return
    }
    toast.loading(`Downloading ${selectedPhotos.length} photo(s)...`, { id: 'bulk-download' })
    const photosToDownload = matches.filter((p) => selectedPhotos.includes(p.id))
    for (let i = 0; i < photosToDownload.length; i++) {
      const idx = matches.findIndex((p) => p.id === photosToDownload[i].id)
      await downloadPhoto(photosToDownload[i], idx)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    toast.success('Selected photos downloaded!', { id: 'bulk-download' })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Share link copied to clipboard!')
  }

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevPhoto = () => { if (lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1) }
  const nextPhoto = () => { if (lightboxIndex < matches.length - 1) setLightboxIndex(lightboxIndex + 1) }

  const totalPhotosDisplay = totalEventPhotos > 1000
    ? `${(totalEventPhotos / 1000).toFixed(1)}k`
    : totalEventPhotos.toString()

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-300 font-body antialiased justify-between">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden py-16 border-b border-white/[0.04] bg-[#0b1120]/40">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
                <CheckCircle className="w-4 h-4" />
                Analysis Complete
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight mb-2">
                Your Photos Are Ready!
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Analyzed today at {timeString} • Found <span className="text-white font-bold">{matches.length} matches</span> from {totalEventPhotos.toLocaleString()} photos
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={downloadAll}
                className="btn-primary text-xs uppercase tracking-wider shadow-none hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <DownloadCloud className="w-5 h-5" />
                Download All (ZIP)
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary text-xs uppercase tracking-wider"
              >
                <Share2 className="w-5 h-5" />
                Share Gallery
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-20 py-12 w-full">
        {/* Controls Bar */}
        <div className="sticky top-[72px] z-40 bg-slate-900/60 backdrop-blur border border-white/[0.08] rounded-2xl p-4 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedPhotos.length === matches.length && matches.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-white/[0.08] bg-slate-950 text-indigo-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">Select All</span>
            </label>
            <div className="h-6 w-px bg-white/[0.08] hidden sm:block"></div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline-block">
              Showing <span className="font-bold text-white">{matches.length} matched photos</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-900 border-white/[0.08] text-indigo-400' : 'bg-slate-950 border-white/[0.08] text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-900 border-white/[0.08] text-indigo-400' : 'bg-slate-950 border-white/[0.08] text-slate-500 hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-900 border border-white/[0.08] text-indigo-400 rounded-xl">
                <ScanFace className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matching</span>
            </div>
            <h4 className="text-3xl font-heading font-extrabold text-white">99.8%</h4>
            <p className="text-slate-400 text-xs mt-1">Match Confidence</p>
          </div>

          <div className="glass-card p-6 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-900 border border-white/[0.08] text-amber-400 rounded-xl">
                <Timer className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Speed</span>
            </div>
            <h4 className="text-3xl font-heading font-extrabold text-white">{analysisTime}</h4>
            <p className="text-slate-400 text-xs mt-1">Processing Time</p>
          </div>

          <div className="glass-card p-6 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-900 border border-white/[0.08] text-emerald-400 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matched</span>
            </div>
            <h4 className="text-3xl font-heading font-extrabold text-white">{matches.length} / {totalPhotosDisplay}</h4>
            <p className="text-slate-400 text-xs mt-1">Photos found for you</p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          : "grid grid-cols-1 gap-4 max-w-xl mx-auto"
        }>
          {matches.map((photo, index) => {
            const isSelected = selectedPhotos.includes(photo.id)
            return (
              <div
                key={photo.id}
                onClick={() => toggleSelect(photo.id)}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border transition-all hover:shadow-xl cursor-pointer ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white/[0.08]'
                }`}
              >
                <img
                  src={photo.downloadUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(photo.id) }}
                    className="w-5 h-5 rounded border-white/[0.08] bg-slate-950 text-indigo-500 focus:ring-0 cursor-pointer self-start"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadPhoto(photo, index) }}
                      className="w-8 h-8 bg-slate-900 border border-white/[0.08] rounded-full flex items-center justify-center text-white hover:bg-indigo-500 hover:border-indigo-500 transition-all cursor-pointer shadow"
                    >
                      {downloading === index ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openLightbox(index) }}
                      className="w-8 h-8 bg-slate-900 border border-white/[0.08] rounded-full flex items-center justify-center text-white hover:bg-indigo-500 hover:border-indigo-500 transition-all cursor-pointer shadow"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Always-visible selection ring indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border border-indigo-400">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom — Re-upload Selfie */}
        <div className="mt-16 flex flex-col items-center justify-center border-t border-white/[0.06] pt-16 pb-12">
          <p className="text-slate-400 mb-6 text-sm font-medium">Not seeing a specific photo? Try refining your selfie analysis.</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-secondary text-xs uppercase tracking-wider cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Re-upload Selfie
            </button>
          )}
        </div>
      </main>

      {/* Floating Bulk Actions Bar */}
      {selectedPhotos.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-slate-900/90 backdrop-blur text-white rounded-full shadow-2xl flex items-center gap-8 border border-white/[0.1] animate-scale-in">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {selectedPhotos.length}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">Selected</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08]"></div>
          <div className="flex items-center gap-6">
            <button
              onClick={downloadSelected}
              className="text-xs font-bold uppercase tracking-wider hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="text-xs font-bold uppercase tracking-wider hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2.5 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-white rounded-full transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={prevPhoto}
              className="absolute left-4 p-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-white/80 hover:text-white transition-colors rounded-full z-10 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {lightboxIndex < matches.length - 1 && (
            <button
              onClick={nextPhoto}
              className="absolute right-4 p-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-white/80 hover:text-white transition-colors rounded-full z-10 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-xl w-full flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl max-h-[75vh]">
              <img
                src={matches[lightboxIndex].downloadUrl}
                alt="Lightbox Preview"
                className="w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="flex items-center gap-3 mt-5">
              <span className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60 rounded-full border border-white/[0.08]">
                {lightboxIndex + 1} of {matches.length} • {matches[lightboxIndex].confidence}% match
              </span>
              <button
                onClick={() => downloadPhoto(matches[lightboxIndex], lightboxIndex)}
                className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchedPhotosGallery
