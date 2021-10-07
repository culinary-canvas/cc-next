import { FirebaseApp, initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'
import { FirebaseStorage, getStorage } from 'firebase/storage'
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from 'firebase/functions'

export function firebase(): {
  firebase: FirebaseApp
  db: Firestore
  storage: FirebaseStorage
  functions: Functions
} {
  try {
    const firebase = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    })

    const functions = getFunctions(firebase)
    if (process.env.NODE_ENV === 'development') {
      connectFunctionsEmulator(functions, 'localhost', 5001)
    }
    const db = getFirestore(firebase)
    const storage = getStorage(firebase)

    return { firebase, db, storage, functions }
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack)
    }
  }
}
