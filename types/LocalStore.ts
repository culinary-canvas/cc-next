import { action, computed, observable } from 'mobx'

import Store from './Store'

/**
 * A local store is always instantiated when needed.
 * It is not registered in the RootStore, however it can
 * be given a reference to the RootStore when instantiated.
 *
 * @abstract
 * @class StoreLocal
 */
abstract class LocalStore implements Store {
  @observable private _loading = false
  @observable private _initiated = false

  @computed get loading() {
    return this._loading
  }

  @computed get initiated() {
    return this._initiated
  }

  constructor() {}

  @computed
  get ready() {
    return this.initiated && !this.loading
  }

  @action
  setLoading(loading = true) {
    this._loading = loading
  }

  @action
  setInitiated(initiated = true) {
    this._initiated = initiated
  }

  abstract onDestroy(): void | Promise<void>
}
export default LocalStore
