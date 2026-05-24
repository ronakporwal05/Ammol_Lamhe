// Client-side image compression and Base64 encoding to bypass Firebase Storage completely!
// This keeps the MVP 100% free under the default Firebase Spark plan, and avoids payment/upgrade prompts.

export const uploadPhoto = async (eventId, file, photoId) => {
  return new Promise((resolve, reject) => {
    // Check if the file size is 0 (typical for online-only OneDrive files when the sync engine is disconnected)
    if (file.size === 0) {
      reject(new Error('ONEDRIVE_OFFLINE_FILE'))
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 800
        let width = img.width
        let height = img.height

        // Downscale image to max 800px dimension
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Compress as high-quality JPEG at 0.75 compression (resulting in ~50KB - 90KB)
        // This easily fits in Firestore's 1MB document limit and loads instantly!
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75)
        
        resolve({
          storagePath: `local_base64_${photoId}`,
          downloadUrl: compressedBase64,
        })
      }
      img.onerror = () => {
        reject(new Error('Failed to load image file.'))
      }
      img.src = event.target.result
    }
    reader.onerror = () => {
      reject(new Error('ONEDRIVE_OFFLINE_FILE'))
    }
    reader.readAsDataURL(file)
  })
}

export const deleteStoragePhoto = async (storagePath) => {
  // Local base64 images don't occupy cloud storage, so deleting is a simple no-op!
  return Promise.resolve()
}
