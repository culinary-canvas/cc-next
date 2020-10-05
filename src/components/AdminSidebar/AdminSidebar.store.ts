import { action, computed, observable } from 'mobx'
import Store from '../../types/Store'
import {FormControl} from '../../services/formControl/FormControl'
import {Article} from '../../domain/Article/Article'
import {Section} from '../../domain/Section/Section'
import {Content} from '../../domain/Content/Content'

export class AdminSidebarStore implements Store {
  @observable _isOpen = false
  @observable formControl: FormControl<Article>
  @observable section: Section
  @observable content: Content

  @computed get article() {
    return this.formControl.mutable
  }

  @computed get contentColumn() {
    return this.section.columns.find((col) =>
      col.some((c) => c.uid === this.content.uid),
    )
  }

  @computed get shouldRender() {
    return !!this.formControl
  }

  @computed get isOpen() {
    return !!this.shouldRender && this._isOpen
  }

  isSectionInEdit(section: Section) {
    return this.section?.uid === section?.uid
  }

  isContentInEdit(content: Content) {
    return this.content?.uid === content?.uid
  }

  @action
  init(formControl: FormControl<Article>) {
    this.formControl = formControl
    this.section = this.article.titleSection
    this.content = this.article.titleSection.contents[0]
  }

  @action
  setSection(section: Section) {
    if (this.section.uid !== section.uid) {
      this.section = section
      this.content = !!section.contents ? section.contents[0] : null
    }
  }

  @action
  setContent(content: Content) {
    this.content = content
  }

  @action
  open() {
    this._isOpen = true
  }

  @action
  toggle() {
    this._isOpen = !this._isOpen
  }

  @action
  onDestroy(): void {
    this._isOpen = false
    this.formControl = null
    this.section = null
  }
}
