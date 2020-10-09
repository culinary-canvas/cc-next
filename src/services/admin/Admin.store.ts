import Store from '../../types/Store'
import { action, computed, observable } from 'mobx'
import { Article } from '../../domain/Article/Article'
import { Section } from '../../domain/Section/Section'
import { Content } from '../../domain/Content/Content'
import { FormControl } from '../formControl/FormControl'

type Serialized = Pick<AdminStore, 'showUnpublishedOnStartPage' | 'sidebar'>

export class AdminStore extends Store<Serialized> {
  @observable showUnpublishedOnStartPage = false
  @observable sidebar = false
  @observable sidebarOpen = false
  @observable formControl: FormControl<Article>
  @observable section: Section
  @observable content: Content

  @computed
  get article() {
    return this.formControl?.mutable
  }

  @action
  toggleShowUnpublishedOnStartPage() {
    console.log('toggling')
    this.showUnpublishedOnStartPage = !this.showUnpublishedOnStartPage
  }

  @action
  renderSidebar() {
    this.sidebar = true
  }

  @action
  removeSidebar() {
    this.sidebar = false
  }

  @action
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen
  }

  @action
  openSidebar() {
    this.sidebarOpen = true
  }

  @action
  closeSidebar() {
    this.sidebarOpen = false
  }

  @action
  setFormControl(formControl: FormControl<Article>) {
    this.formControl = formControl
  }

  @action
  setSection(section: Section) {
    this.section = section
  }

  @action
  setContent(content: Content) {
    this.content = content
  }

  onDestroy(): void {}
}
