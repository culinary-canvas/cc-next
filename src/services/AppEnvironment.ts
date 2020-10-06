import { createContext, useContext } from 'react'
import { ArticleStore } from '../domain/Article/Article.store'
import { AdminSidebarStore } from '../components/AdminSidebar/AdminSidebar.store'
import { AdminStore } from './admin/Admin.store'
import { ImageModalStore } from '../components/ImageModal/ImageModal.store'
import { TagStore } from '../domain/Tag/Tag.store'
import { dateTimeService } from '../domain/DateTime/DateTime.service'
import { OverlayStore } from './OverlayStore'
import { action, observable } from 'mobx'

export type SerializedAppEnvironment = Pick<
  AppEnvironment,
  | 'articleStore'
  | 'adminSidebarStore'
  | 'adminStore'
  | 'imageModalStore'
  | 'overlayStore'
  | 'tagStore'
>

export class AppEnvironment {
  @observable initialized = false
  public articleStore = new ArticleStore()
  public adminSidebarStore = new AdminSidebarStore()
  public adminStore = new AdminStore()
  public overlayStore = new OverlayStore()
  public imageModalStore = new ImageModalStore()
  public tagStore = new TagStore()

  constructor(serialized?: SerializedAppEnvironment) {
    if (!!serialized) {
      this.articleStore = new ArticleStore(serialized.articleStore)
      this.adminSidebarStore = new AdminSidebarStore(
        serialized.adminSidebarStore,
      )
      this.adminStore = new AdminStore(serialized.adminStore)
      this.overlayStore = new OverlayStore(serialized.overlayStore)
      this.imageModalStore = new ImageModalStore(serialized.imageModalStore)
      this.tagStore = new TagStore(serialized.tagStore)
    }
  }

  async init() {
    console.debug('Initializing app...')
    await dateTimeService.init()
    // We want this to run in the background
    // await this.tagStore.load()
    this.initDone()
    console.debug('Initialization done!')
  }

  @action
  initDone() {
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
