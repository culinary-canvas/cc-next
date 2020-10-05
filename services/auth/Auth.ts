import * as firebase from 'firebase/app'
import 'firebase/auth'
import { createContext, useContext } from 'react'

export class Auth {
  user: firebase.User
  initialized = false

  get isSignedIn() {
    return !!this.user
  }

  init() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => this.authStateChanged(user))
    this.initialized = true
  }

  async signIn(email: string, password: string) {
    await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  async signOut() {
    await firebase.auth().signOut()
    this.setUser(null)
  }

  private authStateChanged(user: firebase.User) {
    this.setUser(user)
    this.initialized = true
  }

  private setUser(user: firebase.User) {
    this.user = user
  }
}

export const AuthContext = createContext(null)

export function useAuth(): Auth {
  const context = useContext<Auth>(AuthContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Auth context')
  }
  return context
}
