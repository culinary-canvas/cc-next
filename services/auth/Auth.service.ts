import * as firebase from 'firebase/app'
import 'firebase/auth'
import { action, computed, observable } from 'mobx'

class AuthService {
  @observable user: firebase.User
  @observable initialized = false

  @computed get isSignedIn() {
    return !!this.user
  }

  init() {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => this.authStateChanged(user))
  }

  signIn(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
  }

  async signOut() {
    await firebase.auth().signOut()
    this.setUser(null)
  }

  private authStateChanged(user: firebase.User) {
    this.setUser(user)
    this.initialized = true
  }

  @action private setInitialized(is = true) {
    this.initialized = is
  }

  @action setUser(user: firebase.User) {
    this.user = user
  }
}

export const authService = new AuthService()
