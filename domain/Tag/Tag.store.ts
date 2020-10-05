import { action, observable } from 'mobx'
import { Tag } from './Tag'
import { TagApi } from './Tag.api'

export class TagStore {
  @observable tags: Tag[] = []

  async load() {
    const tags = await TagApi.all()
    this.set(tags)
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
    return this.tags.filter((t) => ids.includes(t.id))
  }

  exists(name: string) {
    return this.tags.some((t) => t.name === name)
  }
}
