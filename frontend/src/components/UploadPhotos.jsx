import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getEvent, subscribeToPhotos, addPhoto, deletePhoto, updateEventPhotoCount } from '@backend/firebase/firestore'
import { uploadPhoto, deleteStoragePhoto } from '@backend/firebase/storage'
import { ArrowLeft, Image as ImageIcon, Upload, Trash2, Check, Clock, PlusCircle, ArrowRight } from 'lucide-react'
import Spinner from '@/components/Spinner'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const UploadPhotos = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Upload queue tracking
  const [uploadQueue, setUploadQueue] = useState([]) // { file, name, size, status: 'pending'|'uploading'|'done'|'error', progress: 0 }
  const [overallProgress, setOverallProgress] = useState(0)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [totalUploadCount, setTotalUploadCount] = useState(0)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await getEvent(eventId)
        if (eventData) {
          setEvent(eventData)
        } else {
          toast.error('Event not found')
          navigate('/admin/events')
        }
      } catch (error) {
        console.error('Error loading event:', error)
        toast.error('Failed to load event')
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [eventId, navigate])

  useEffect(() => {
    if (!eventId) return
    const unsubscribe = subscribeToPhotos(
      eventId,
      (photoList) => setPhotos(photoList),
      (error) => {
        console.error('Photos listener error:', error)
        toast.error('Failed to load photos')
      }
    )
    return () => unsubscribe()
  }, [eventId])

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const processFiles = async (files) => {
    if (files.length === 0) return

    const queue = files.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      previewUrl: URL.createObjectURL(file),
    }))

    setUploadQueue(queue)
    setTotalUploadCount(files.length)
    setUploadedCount(0)
    setOverallProgress(0)
    setUploading(true)

    let completed = 0

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        setUploadQueue((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: 'uploading', progress: 50 } : item))
        )

        const photoId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

        const { storagePath, downloadUrl } = await uploadPhoto(eventId, file, photoId)

        await addPhoto(eventId, {
          storagePath,
          downloadUrl,
          fileName: file.name,
        })

        await updateEventPhotoCount(eventId, 1)

        completed++
        setUploadedCount(completed)
        setOverallProgress(Math.round((completed / files.length) * 100))

        setUploadQueue((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: 'done', progress: 100 } : item))
        )
      }

      toast.success(`${completed} photo(s) uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      if (error.message === 'ONEDRIVE_OFFLINE_FILE') {
        toast.error(
          'Upload Failed: This photo is stored online-only in OneDrive. Please download it first!',
          { duration: 8000 }
        )
      } else {
        toast.error('Some photos failed to upload. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    await processFiles(files)
    e.target.value = ''
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  const handleDeletePhoto = async (photo) => {
    if (!window.confirm('Delete this photo?')) return
    try {
      await deleteStoragePhoto(photo.storagePath)
      await deletePhoto(eventId, photo.id)
      await updateEventPhotoCount(eventId, -1)
      toast.success('Photo deleted')
    } catch (error) {
      console.error('Delete photo error:', error)
      toast.error('Failed to delete photo')
    }
  }

  const clearQueue = () => {
    setUploadQueue([])
    setOverallProgress(0)
    setUploadedCount(0)
    setTotalUploadCount(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Spinner text="Loading event..." size="lg" />
      </div>
    )
  }

  const isActive = photos.length > 0

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col justify-between font-body antialiased">
      <NavigationBar activeTab="dashboard" />

      <main className="flex-grow py-12 px-5 sm:px-10 lg:px-20 max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => navigate('/admin/dashboard')}
              id="back-link"
              className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 transition-colors text-[11px] font-bold uppercase tracking-widest cursor-pointer self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-white">Upload Photos</h1>
            <p className="text-slate-400 text-sm font-medium">
              {event?.name} • {event?.date || 'June 15, 2026'}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border mt-1.5 ${
              isActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {isActive ? 'Active Event' : 'Draft Event'}
            </span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="glass-panel rounded-[2.5rem] border border-white/[0.08] shadow-2xl overflow-hidden mb-8">
          {/* Dropzone Area */}
          <div
            className={`p-8 md:p-12 border-b border-dashed border-white/[0.08] text-center group cursor-pointer transition-colors ${
              dragActive ? 'bg-slate-900/30' : 'hover:bg-slate-900/10'
            }`}
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-slate-950/80 border border-white/[0.08] rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-105 group-hover:border-indigo-500/30 transition-all duration-300">
              <Upload className={`w-9 h-9 transition-colors ${dragActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              {dragActive ? 'Drop your photos here' : 'Drag and drop event photos'}
            </h2>
            <p className="text-slate-400 mb-8 text-sm font-normal">
              or click to browse from your computer. Supports high-res JPG, PNG (Max 50MB per file).
            </p>
            <button
              type="button"
              disabled={uploading}
              className="btn-primary text-xs uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Select Files <PlusCircle className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              id="photo-upload-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {/* Upload Progress Section */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Upload Progress</h3>
                <p className="text-slate-400 text-sm">
                  {uploadQueue.length > 0
                    ? `${uploadedCount} of ${totalUploadCount} files uploaded`
                    : `${photos.length} photos in this event`}
                </p>
              </div>
              <span className="text-white font-heading font-bold text-xl">
                {uploadQueue.length > 0 ? `${overallProgress}%` : `${photos.length}`}
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full h-3 bg-slate-950/80 border border-white/[0.04] rounded-full overflow-hidden mb-8">
              <div
                className={`h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500 ${uploading ? 'animate-pulse' : ''}`}
                style={{ width: uploadQueue.length > 0 ? `${overallProgress}%` : '100%' }}
              ></div>
            </div>

            {/* File Queue List */}
            {uploadQueue.length > 0 && (
              <div className="space-y-4">
                {uploadQueue.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-slate-950/40 border border-white/[0.08] ${
                      item.status === 'pending' ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-slate-900 border border-white/[0.08] rounded-lg overflow-hidden flex-shrink-0">
                      {item.previewUrl ? (
                        <img src={item.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="text-slate-500 w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white truncate">{item.name}</span>
                        <span className="text-slate-400 text-xs ml-2 shrink-0">
                          {item.status === 'pending' ? 'Pending' : formatFileSize(item.size)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 border border-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {item.status === 'done' ? (
                      <Check className="text-emerald-400 w-5 h-5 shrink-0" />
                    ) : item.status === 'uploading' ? (
                      <span className="text-slate-400 text-xs font-bold shrink-0">{item.progress}%</span>
                    ) : (
                      <Clock className="text-slate-500 w-5 h-5 shrink-0" />
                    )}
                  </div>
                ))}

                {!uploading && (
                  <button
                    onClick={clearQueue}
                    className="w-full mt-4 py-4 text-slate-400 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Clear Upload Queue
                  </button>
                )}
              </div>
            )}

            {/* Existing Photos Gallery */}
            {uploadQueue.length === 0 && photos.length > 0 && (
              <div className="space-y-4">
                {photos.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/40 border border-white/[0.08]"
                  >
                    <div className="w-12 h-12 bg-slate-900 border border-white/[0.08] rounded-lg overflow-hidden flex-shrink-0">
                      <img src={photo.downloadUrl} alt={photo.fileName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-white truncate">{photo.fileName || 'Photo'}</span>
                        <span className="text-slate-400 text-xs ml-2 shrink-0 font-bold uppercase tracking-wider text-emerald-400">Uploaded</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 border border-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo)}
                      className="text-red-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {photos.length > 6 && (
                  <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest pt-2">
                    + {photos.length - 6} more photos
                  </p>
                )}
              </div>
            )}

            {uploadQueue.length === 0 && photos.length === 0 && (
              <div className="text-center py-8">
                <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No photos uploaded yet. Drag files above to begin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            id="cancel-upload"
            className="w-full sm:w-auto btn-secondary text-xs tracking-wider"
          >
            Cancel Upload
          </button>
          <Link
            to={`/admin/share/${eventId}`}
            id="next-step"
            className="w-full sm:w-auto btn-primary text-xs tracking-wider bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-none hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Continue to Sharing <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UploadPhotos
