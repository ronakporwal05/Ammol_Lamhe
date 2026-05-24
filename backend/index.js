// Backend barrel export — Firebase services
export { auth, db, storage } from './firebase/config'
export { loginWithEmail, signupWithEmail, logout } from './firebase/auth'
export {
  createEvent,
  getEvent,
  deleteEvent,
  updateEventPhotoCount,
  incrementClientCount,
  subscribeToEvents,
  addPhoto,
  getEventPhotos,
  deletePhoto,
  subscribeToPhotos,
} from './firebase/firestore'
export { uploadPhoto, deleteStoragePhoto } from './firebase/storage'
