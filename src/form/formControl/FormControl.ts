import { cloneDeep, get, isEqual, isFinite, set } from 'lodash'
import {
  action,
  computed,
  IArrayChange,
  IArraySplice,
  IMapDidChange,
  IObjectDidChange,
  observable,
  toJS,
} from 'mobx'
import { deepObserve, IDisposer } from 'mobx-utils'
import ObjectUtils from '../../services/utils/ObjectUtils'
import StringUtils from '../../services/utils/StringUtils'
import { FormControlFieldConfig } from './FormControlFieldConfig'

declare type IChange =
  | IObjectDidChange
  | IArrayChange
  | IArraySplice
  | IMapDidChange

declare interface OldAndNewValue {
  oldValue: any
  newValue: any
}

export class FormControl<T> {
  @observable private original: T
  @observable mutable: T
  @observable changes = new Map<string, OldAndNewValue>()
  @observable private fieldConfigs: FormControlFieldConfig[]
  @observable isTouched = false
  dispose: IDisposer

  @computed
  get isUntouched() {
    return !this.isTouched
  }

  @computed
  get isDirty() {
    return !!this.changes.size
  }

  @computed
  get isClean() {
    return !this.changes.size
  }

  @computed
  get isInvalid() {
    return this.fieldConfigs.some(
      (conf) =>
        conf.required && ObjectUtils.hasNoValue(get(this.mutable, conf.field)),
    )
  }

  @computed
  get isValid() {
    return !this.isInvalid
  }

  constructor(object: T, fieldConfigs: FormControlFieldConfig[] = []) {
    this.init(object, fieldConfigs)
  }

  @action
  reset(object = this.mutable, fieldConfigs = this.fieldConfigs) {
    this.changes.clear()
    this.init(object, fieldConfigs)
  }

  @action
  revert(path: string) {
    set(this.mutable, path, get(this.original, path))
  }

  private init(object: T, fieldConfigs: FormControlFieldConfig[]) {
    this.original = cloneDeep(object)
    this.mutable = object
    this.fieldConfigs = fieldConfigs
    this.dispose = deepObserve(this.mutable, (change, path) => this.onChange(path, change))
  }

  private onChange(path: string, change: IChange) {
    this.isTouched = true
    this.registerChange(path, change)
  }

  private registerChange(path: string, change: IChange) {
    const fullPath = this.transformMobxPathToLodashPath(path, change)
    const oldValue = get(toJS(this.original), fullPath)
    const newValue = ObjectUtils.hasKey(change, 'newValue')
      ? (change as any).newValue
      : get(toJS(this.mutable), fullPath)

    if (
      isEqual(oldValue, newValue) ||
      StringUtils.isEqual(oldValue, newValue)
    ) {
      this.deleteChange(fullPath)
    } else {
      this.setChange(fullPath, { oldValue, newValue })
    }
  }

  private transformMobxPathToLodashPath(path: string, change: IChange) {
    const fullMobxPath = ObjectUtils.hasKey(change, 'name')
      ? `${path}/${(change as any).name}`
      : path
    const parts = fullMobxPath.split('/').filter((part) => part.trim() !== '')

    return parts.reduce((lodashPath, part, index) => {
      if (index > 0 && !isFinite(Number(part))) {
        lodashPath += '.'
      }
      lodashPath += isFinite(Number(part)) ? '[' + part + ']' : part
      return lodashPath
    }, '')
  }

  @action
  private setChange(path, values: { oldValue: any; newValue: any }) {
    this.changes.set(path, values)
  }

  @action
  private deleteChange(path) {
    this.changes.delete(path)
  }
}
