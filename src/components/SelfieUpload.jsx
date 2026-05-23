import { useState, useRef } from 'react'
import { Upload, Camera, User, Sparkles } from 'lucide-react'

const SelfieUpload = ({ onUpload, processing, progress }) => {
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    onUpload(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
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

  if (processing) {
    return (
      <div className="glass-panel rounded-[2rem] border border-white/[0.08] p-12 text-center animate-scale-in shadow-2xl">
        <div className="relative w-32 h-32 mx-auto mb-8">
          {preview && (
            <img
              src={preview}
              alt="Selfie preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-900 shadow-xl relative z-10 mx-auto"
            />
          )}
          {/* Elegant active spinner scanning ring */}
          <div className="absolute inset-0 flex items-center justify-center -m-2">
            <div className="w-[140px] h-[140px] border-2 border-dashed border-indigo-500 rounded-full animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="text-base font-heading font-extrabold text-white uppercase tracking-wider">
            Facial Signature Scanning
          </h3>
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-6">
          {progress || 'Matching signatures...'}
        </p>

        <div className="w-full max-w-[200px] mx-auto bg-slate-950/80 border border-white/[0.04] rounded-full h-1.5 overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full animate-pulse" style={{ width: '65%' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel rounded-[2rem] border border-white/[0.08] p-8 sm:p-12 shadow-2xl animate-scale-in w-full">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/[0.08] flex items-center justify-center mx-auto mb-5 shadow-inner">
          <User className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-white mb-2">
          Find Your Photos
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Smart Face Signature Matching
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-5 p-10 sm:p-14 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02]'
            : 'border-white/[0.08] hover:border-indigo-500/30 hover:bg-slate-900/10'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-slate-950 border border-white/[0.08] flex items-center justify-center shadow-sm mb-2">
          <Camera className="w-6 h-6 text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-2">
            Tap to upload selfie
          </p>
          <p className="text-xs text-slate-500 font-medium">
            or drag and drop your portrait here
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        id="selfie-upload-input"
        type="file"
        capture="user"
        onChange={handleChange}
        className="hidden"
      />

      <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-start gap-4 bg-slate-950/40 border border-white/[0.08] rounded-2xl p-5">
        <span className="text-2xl leading-none">💡</span>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          <strong className="text-white font-bold">Pro Tip:</strong> For accurate matching, use a clear, well-lit photo looking straight at the camera without sunglasses.
        </p>
      </div>
    </div>
  )
}

export default SelfieUpload
