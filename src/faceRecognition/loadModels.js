import * as faceapi from 'face-api.js'

let modelsLoaded = false

/**
 * Load face-api.js models from the /models directory
 * Models: ssdMobilenetv1, faceLandmark68Net, faceRecognitionNet
 */
export const loadModels = async () => {
  if (modelsLoaded) return true

  try {
    const MODEL_URL = '/models'
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ])
    modelsLoaded = true
    console.log('Face-api.js models loaded successfully')
    return true
  } catch (error) {
    console.error('Error loading face-api.js models:', error)
    throw error
  }
}

export const areModelsLoaded = () => modelsLoaded
