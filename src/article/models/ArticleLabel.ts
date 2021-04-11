import { observable } from 'mobx'

export class ArticleLabel {
  @observable label: string
  @observable path: string

  constructor(label: string, path?: string) {
    this.label = label
    this.path = path
  }
}
