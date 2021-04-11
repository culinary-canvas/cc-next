import { cloneDeep, get, isEqual, isFinite, set } from 'lodash'
import {
  action,
  computed,
  IArrayDidChange,
  IArraySplice,
  IMapDidChange,
  IObjectDidChange,
  makeObservable,
  observable,
  toJS,
} from 'mobx'
import { deepObserve, IDisposer } from 'mobx-utils'
import ObjectUtils from '../utils/ObjectUtils'
import StringUtils from '../utils/StringUtils'
import { FormControlFieldConfig } from './FormControlFieldConfig'
import { ValidationResult } from './ValidationResult'
import { Field } from './Field'

declare type IChange =
  | IObjectDidChange
  | IArrayDidChange
  | IArraySplice
  | IMapDidChange

declare interface OldAndNewValue {
  oldValue: any
  newValue: any
}

export class FormControl<T> {
  @observable private original: T
  @observable mutable: T
  @observable changes = new Map<Field<T>, OldAndNewValue>()
  @observable private fieldConfigs: FormControlFieldConfig<T>[]
  @observable blurredFields = new Set<Field<T>>()
  @observable touchedFields = new Set<Field<T>>()
  @observable disabled = false

  private disposers: IDisposer[] = []

  @computed
  get isTouched() {
    return !!this.touchedFields.size
  }

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
  get validationResults(): ValidationResult<T>[] {
    return this.fieldConfigs.map((field) => this.validateField(field))
  }

  @computed
  get errors(): ValidationResult<T>[] {
    return this.validationResults.filter(
      (v) => this.blurredFields.has(v.field) && !v.valid,
    )
  }

  @computed
  get errorFields(): Field<T>[] {
    return this.errors.map((v) => v.field)
  }

  @computed
  get isInvalid() {
    return !!this.errors.length
  }

  @computed
  get isValid() {
    return !this.isInvalid
  }

  constructor(object: T, fieldConfigs: FormControlFieldConfig<T>[] = []) {
    makeObservable(this)
    this.init(object, fieldConfigs)
  }

  @action
  reset(object = this.mutable, fieldConfigs = this.fieldConfigs) {
    this.changes.clear()
    this.dispose()
    this.init(object, fieldConfigs)
  }

  @action
  revert(path: string) {
    set(this.mutable, path, get(this.original, path))
  }

  @action
  dispose(): any {
    this.disposers.forEach((d) => d())
    this.disposers = []
  }

  @action
  setFieldBlurred(field: Field<T>) {
    this.blurredFields.add(field)
    this.touchedFields.add(field)
  }

  @action
  setDisabled(disabled = true) {
    this.disabled = disabled
  }

  getValidationResult(field: Field<T>) {
    return this.validationResults.find((r) => r.field === field)
  }

  private init(object: T, fieldConfigs: FormControlFieldConfig<T>[]) {
    this.original = cloneDeep(object)
    this.mutable = object
    this.fieldConfigs = fieldConfigs
    this.disposers.push(
      deepObserve(this.mutable, (change, path) => this.onChange(path, change)),
    )
  }

  private onChange(path: string, change: IChange) {
    const fullPath = this.transformMobxPathToLodashPath(path, change)

    this.touchedFields.add(fullPath)

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

  private validateField(
    config: FormControlFieldConfig<T>,
  ): ValidationResult<T> {
    const value = get(this.mutable, config.field)
    const validationResult = {
      valid: true,
      errorMessage: undefined,
      field: config.field,
      value: value,
    }

    if (!config) {
      return validationResult
    }

    if (config.required) {
      validationResult.valid = ObjectUtils.hasValue(value)
      if (!validationResult.valid) {
        validationResult.errorMessage = 'This field is required'
        return validationResult
      }
    }

    if (!!config.validate) {
      validationResult.errorMessage = config.validate(
        get(this.mutable, config.field),
      )
      validationResult.valid = !validationResult.errorMessage
    }
    return validationResult
  }
}
