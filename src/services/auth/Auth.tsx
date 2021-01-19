import firebase from 'firebase/app'
import 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { initFirebase } from '../firebase/Firebase'

export interface Auth {
  readonly userId: string
  readonly isSignedIn: boolean
  readonly init: () => void
  readonly signIn: (email: string, password: string) => Promise<void>
  readonly signOut: () => Promise<void>
}

export function useAuthState(): Auth {
  const [user, setUser] = useState<firebase.User>()
  const [userId, setUserId] = useState<string>()
  const isSignedIn = useMemo(() => !!user, [user])

  const init = () => {
    initFirebase()
    firebase.auth().onAuthStateChanged((user) => authStateChanged(user))
  }
  const signIn = async (email: string, password: string) => {
    initFirebase()
    await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  const signOut = useCallback(async () => {
    await firebase.auth().signOut()
    setUser(null)
  }, [])

  function authStateChanged(user: firebase.User) {
    setUser(user)
    setUserId(user?.uid)
  }

  return {
    userId,
    isSignedIn,
    init,
    signIn,
    signOut,
  }
}

export const AuthContext = createContext<Auth>(null)

export function useAuth(): Auth {
  const context = useContext<Auth>(AuthContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Auth context')
  }
  return context
}
