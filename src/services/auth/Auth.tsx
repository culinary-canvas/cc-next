import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as authSignOut,
  User,
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { firebase } from '../firebase/Firebase'

export interface Auth {
  readonly userId: string
  readonly isSignedIn: boolean
  readonly init: () => void
  readonly signIn: (email: string, password: string) => Promise<void>
  readonly signOut: () => Promise<void>
}

export function useAuthState(): Auth {
  const [user, setUser] = useState<User>()
  const [userId, setUserId] = useState<string>()
  const isSignedIn = useMemo(() => !!user, [user])

  const init = () => {
    const { firebase: firebaseApp } = firebase()
    const auth = getAuth(firebaseApp)
    onAuthStateChanged(auth, (user) => authStateChanged(user))
  }
  const signIn = async (email: string, password: string) => {
    const { firebase: firebaseApp } = firebase()
    const auth = getAuth(firebaseApp)
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = useCallback(async () => {
    const { firebase: firebaseApp } = firebase()
    const auth = getAuth(firebaseApp)
    await authSignOut(auth)
    setUser(null)
  }, [])

  function authStateChanged(user: User) {
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
