import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './config'

// ===== EVENTS =====

export const createEvent = async (data) => {
  const docRef = await addDoc(collection(db, 'events'), {
    ...data,
    photoCount: 0,
    clientCount: 0,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const getEvent = async (eventId) => {
  const docRef = doc(db, 'events', eventId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  }
  return null
}

export const deleteEvent = async (eventId) => {
  await deleteDoc(doc(db, 'events', eventId))
}

export const updateEventPhotoCount = async (eventId, change) => {
  await updateDoc(doc(db, 'events', eventId), {
    photoCount: increment(change),
  })
}

export const incrementClientCount = async (eventId) => {
  await updateDoc(doc(db, 'events', eventId), {
    clientCount: increment(1),
  })
}

export const subscribeToEvents = (callback, onError) => {
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(events)
  }, onError)
}

// ===== PHOTOS =====

export const addPhoto = async (eventId, photoData) => {
  const docRef = await addDoc(collection(db, 'events', eventId, 'photos'), {
    ...photoData,
    uploadedAt: serverTimestamp(),
  })
  return docRef.id
}

export const getEventPhotos = async (eventId) => {
  const q = query(
    collection(db, 'events', eventId, 'photos'),
    orderBy('uploadedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const deletePhoto = async (eventId, photoId) => {
  await deleteDoc(doc(db, 'events', eventId, 'photos', photoId))
}

export const subscribeToPhotos = (eventId, callback, onError) => {
  const q = query(
    collection(db, 'events', eventId, 'photos'),
    orderBy('uploadedAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const photos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(photos)
  }, onError)
}
