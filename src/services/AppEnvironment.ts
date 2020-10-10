import { createContext, useContext } from 'react'
import { AdminStore } from './admin/Admin.store'
import { ImageModalStore } from '../components/ImageModal/ImageModal.store'
import { dateTimeService } from '../domain/DateTime/DateTime.service'
import { OverlayStore } from './OverlayStore'
import { action, observable } from 'mobx'

export type SerializedAppEnvironment = Pick<
  AppEnvironment,
  'adminStore' | 'imageModalStore' | 'overlayStore'
>

export const IS_DEV = process.env.NODE_ENV === 'development'

export class AppEnvironment {
  @observable initialized = false
  public adminStore = new AdminStore()
  public overlayStore = new OverlayStore()
  public imageModalStore = new ImageModalStore()

  constructor(serialized?: SerializedAppEnvironment) {
    if (!!serialized) {
      this.adminStore = new AdminStore(serialized.adminStore)
      this.overlayStore = new OverlayStore(serialized.overlayStore)
      this.imageModalStore = new ImageModalStore(serialized.imageModalStore)
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
