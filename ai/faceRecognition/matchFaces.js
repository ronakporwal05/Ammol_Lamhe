import * as faceapi from 'face-api.js'
import { detectFace, detectAllFaces } from './detectFace'

/**
 * Euclidean distance threshold for face matching.
 * Lower = stricter matching. Range: 0.0 - 1.0
 * Recommended: 0.5
 */
const MATCH_THRESHOLD = 0.53

/**
 * Match a selfie against event photos.
 *
 * @param {File|Blob} selfieFile - The client's selfie
 * @param {Array} eventPhotos - Array of { id, downloadUrl, ... } photo objects
 * @param {Function} onProgress - Optional callback (current, total) for progress
 * @returns {Array} Matched photos with confidence scores
 */
export const matchFaces = async (selfieFile, eventPhotos, thresholdOrProgress, callback) => {
  let threshold = MATCH_THRESHOLD
  let onProgress = null

  if (typeof thresholdOrProgress === 'number') {
    threshold = thresholdOrProgress
    onProgress = callback
  } else if (typeof thresholdOrProgress === 'function') {
    onProgress = thresholdOrProgress
  }

  // Step 1: Get selfie descriptor
  const selfieDescriptor = await detectFace(selfieFile)

  if (!selfieDescriptor) {
    throw new Error('NO_FACE_IN_SELFIE')
  }

  const matches = []
  const total = eventPhotos.length

  // Step 2: Compare against each event photo
  for (let i = 0; i < eventPhotos.length; i++) {
    const photo = eventPhotos[i]

    if (onProgress) {
      onProgress(i + 1, total)
    }

    try {
      // Detect all faces in the event photo
      const photoDescriptors = await detectAllFaces(photo.downloadUrl)

      // Compare selfie to each face in the photo
      for (const photoDescriptor of photoDescriptors) {
        const distance = faceapi.euclideanDistance(selfieDescriptor, photoDescriptor)

        if (distance < threshold) {
          matches.push({
            ...photo,
            confidence: Math.round((1 - distance) * 100),
            distance: distance.toFixed(3),
          })
          break // Don't need to check other faces in same photo
        }
      }
    } catch (error) {
      console.warn(`Error processing photo ${photo.id}:`, error)
      // Continue to next photo
    }
  }

  // Sort by confidence (highest first)
  matches.sort((a, b) => b.confidence - a.confidence)

  return matches
}
