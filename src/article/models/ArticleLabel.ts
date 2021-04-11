import { makeObservable, observable } from 'mobx'

export class ArticleLabel {
  @observable label: string
  @observable path: string

  constructor(label: string, path?: string) {
    makeObservable(this)
    this.label = label
    this.path = path
  }
}
