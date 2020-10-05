import { action, observable } from 'mobx'

export class OverlayStore {
  @observable isVisible = false
  @observable text: string
  @observable progress: number

  @action
  toggle() {
    this.isVisible = !this.isVisible
    if (this.isVisible) {
      document.querySelector('body').classList.add('no-scroll')
    } else {
      document.querySelector('body').classList.remove('no-scroll')
    }
  }

  @action
  setText(text: string) {
    this.text = text
  }

  @action
  setProgress(progress: number) {
    this.progress = progress
  }

  @action
  addProgress(progress: number) {
    this.progress += progress
  }
}
