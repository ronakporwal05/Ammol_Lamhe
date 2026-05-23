import * as faceapi from 'face-api.js'

/**
 * Detect a face in an image and return its descriptor.
 * Accepts either a File/Blob or an image URL string.
 * Returns the descriptor (Float32Array) or null if no face found.
 */
// Detect single face
export const detectFace = async (input) => {
  let img

  if (input instanceof File || input instanceof Blob) {
    img = await faceapi.bufferToImage(input)
  } else if (typeof input === 'string') {
    img = await loadImageFromUrl(input)
  } else if (input instanceof HTMLImageElement || input instanceof HTMLCanvasElement) {
    img = input
  } else {
    throw new Error('Invalid input type for face detection')
  }

  // Lower confidence threshold (0.32) to capture side-profiles and rotated faces perfectly
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.32 })

  const detection = await faceapi
    .detectSingleFace(img, options)
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!detection) return null

  return detection.descriptor
}

/**
 * Detect ALL faces in an image and return their descriptors.
 * Returns array of Float32Array descriptors.
 */
export const detectAllFaces = async (input) => {
  let img

  if (input instanceof File || input instanceof Blob) {
    img = await faceapi.bufferToImage(input)
  } else if (typeof input === 'string') {
    img = await loadImageFromUrl(input)
  } else if (input instanceof HTMLImageElement || input instanceof HTMLCanvasElement) {
    img = input
  } else {
    throw new Error('Invalid input type for face detection')
  }

  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.32 })

  const detections = await faceapi
    .detectAllFaces(img, options)
    .withFaceLandmarks()
    .withFaceDescriptors()

  return detections.map((d) => d.descriptor)
}

/**
 * Helper to load an image from URL into an HTMLImageElement
 */
const loadImageFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}
