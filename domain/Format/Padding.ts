import { field } from '../../services/db/decorators/field.decorator'
import { action, computed, observable } from 'mobx'
import {isNil} from '../../services/importHelpers'

export interface PaddingValues {
  top: number
  right: number
  bottom: number
  left: number
}

export class Padding {
  constructor(sharedOrTop = 0, right?: number, bottom?: number, left?: number) {
    this.top = sharedOrTop
    this.right = !isNil(right) ? right : sharedOrTop
    this.bottom = !isNil(bottom) ? bottom : sharedOrTop
    this.left = !isNil(left) ? left : sharedOrTop
  }

  @field()
  @observable
  top: number

  @field()
  @observable
  right: number

  @field()
  @observable
  bottom: number

  @field()
  @observable
  left: number

  @field()
  @observable
  topLinked = true

  @field()
  @observable
  rightLinked = true

  @field()
  @observable
  bottomLinked = true

  @field()
  @observable
  leftLinked = true

  @computed
  get values(): {
    top: Readonly<number>
    right: Readonly<number>
    bottom: Readonly<number>
    left: Readonly<number>
  } {
    const { top, right, bottom, left } = this
    return { top, right, bottom, left }
  }

  @computed
  get linked(): (keyof PaddingValues)[] {
    const linked = []
    if (this.topLinked) {
      linked.push('top')
    }
    if (this.rightLinked) {
      linked.push('right')
    }
    if (this.bottomLinked) {
      linked.push('bottom')
    }
    if (this.leftLinked) {
      linked.push('left')
    }
    return linked
  }

  @computed
  get maxLinked(): number {
    return this.linked.reduce((max, k) => (this[k] > max ? this[k] : max), 0)
  }

  @action
  setValue(key: keyof PaddingValues, value: number) {
    this[key] = value

    if (this.isLinked(key)) {
      this.linked.forEach((k) => {
        this[k] = value
      })
    }
  }

  @action
  toggleLinked(key: keyof PaddingValues) {
    this[`${key}Linked`] = !this.isLinked(key)

    if (this.isLinked(key)) {
      const value = this.maxLinked || this[key]
      this.setValue(key, value)
    }
  }

  isLinked(key: keyof PaddingValues) {
    return this.linked.includes(key)
  }
}
