import * as firebase from 'firebase/app'
import 'firebase/auth'
import { createContext, useContext } from 'react'
import Store from '../../types/Store'
import {initFirebase} from '../firebase/Firebase.service'

type SerializedAuth = Pick<Auth, 'user' | 'initialized'>

export class Auth extends Store<SerializedAuth> {
  user: firebase.User

  get isSignedIn() {
    return !!this.user
  }

  init() {
    initFirebase()
    firebase.auth().onAuthStateChanged((user) => this.authStateChanged(user))
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
  }

  private setUser(user: firebase.User) {
    this.user = user
  }

  onDestroy(): void {
    this.user = null
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
