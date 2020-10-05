import Store from '../../types/Store'
import { action, observable } from 'mobx'

export class AdminStore implements Store {
  @observable showUnpublishedOnStartPage = false

  @action
  toggleShowUnpublishedOnStartPage() {
    this.showUnpublishedOnStartPage = !this.showUnpublishedOnStartPage
  }

  onDestroy(): void {}
}
