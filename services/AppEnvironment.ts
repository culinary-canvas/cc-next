import { action, observable } from 'mobx'
import { createContext, useContext } from 'react'
import { ArticleStore } from '../domain/Article/Article.store'
import { AdminSidebarStore } from '../components/AdminSidebar/AdminSidebar.store'
import { AdminStore } from './admin/Admin.store'
import { ImageModalStore } from '../components/ImageModal/ImageModal.store'
import { TagStore } from '../domain/Tag/Tag.store'
import { dateTimeService } from '../domain/DateTime/DateTime.service'
import { firebaseService } from './firebase/Firebase.service'
import { OverlayStore } from './OverlayStore'
import { useStaticRendering } from 'mobx-react-lite'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

let store = null

export default function initializeStore(initialData = { postStore: {} }) {
  if (isServer) {
    return {
      postStore: new PostStore(initialData.postStore),
      uiStore: new UIStore(),
    }
  }
  if (store === null) {
    store = {
      postStore: new PostStore(initialData.postStore),
      uiStore: new UIStore(),
    }
  }

  return store
}

export class AppEnvironment {
  @observable initialized = false

  constructor(
    readonly articleStore = new ArticleStore(),
    readonly adminSidebarStore = new AdminSidebarStore(),
    readonly adminStore = new AdminStore(),
    readonly overlayStore = new OverlayStore(),
    readonly imageModalStore = new ImageModalStore(),
    readonly tagStore = new TagStore(),
  ) {}

  async init() {
    console.debug('Initializing app...')
    await dateTimeService.init()
    await firebaseService.init()
    // We want this to run in the background
    await this.tagStore.load()

    this.initDone()
    console.debug('Initialization done!')
  }

  @action private initDone() {
    this.initialized = true
  }
}

export const AppContext = createContext(null)

export function useEnv(): AppEnvironment {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing App context')
  }
  return context
}
