import Store from '../../types/Store'
import { action, observable } from 'mobx'

type Serialized = Pick<AdminStore, 'showUnpublishedOnStartPage'>

export class AdminStore extends Store<Serialized> {
  @observable showUnpublishedOnStartPage = false

  @action
  toggleShowUnpublishedOnStartPage() {
    this.showUnpublishedOnStartPage = !this.showUnpublishedOnStartPage
  }

  onDestroy(): void {}
}
