import { action, observable, toJS } from 'mobx'
import { Tag } from './Tag'
import Store from '../../types/Store'

type Serialized = Pick<TagStore, 'tags'>

export class TagStore extends Store<Serialized> {
  @observable tags: Tag[] = []

  async load() {
    // const tags = await TagApi.all()
    //  this.set(tags)
  }

  @action
  set(tags: Tag[]) {
    this.tags = tags
  }

  @action
  add(tags: Tag[]) {
    this.tags = [...this.tags, ...tags]
  }

  get(ids: string[]) {
    return this.tags.filter((t) => toJS(ids).includes(t.id))
  }

  exists(name: string) {
    return this.tags.some((t) => t.name === name)
  }

  @action
  onDestroy(): void {
    this.tags = []
  }
}
