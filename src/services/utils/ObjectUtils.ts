import { isEqual, isNil } from 'lodash'

class ObjectUtils {
  static getMethods(obj: any): string[] {
    const properties = new Set<string>()
    let currentObj = obj

    do {
      Object.getOwnPropertyNames(currentObj).forEach((item) =>
        properties.add(item),
      )
    } while ((currentObj = Object.getPrototypeOf(currentObj)))

    return [...Array.from(properties.keys())].filter(
      (item: string) => typeof obj[item] === 'function',
    )
  }

  static hasValue(value: any) {
    return !isNil(value) && String(value).trim() !== ''
  }

  static hasNoValue(value: any) {
    return !ObjectUtils.hasValue(value)
  }

  static equals<T>(object1: T, object2: T, identifier?: string): boolean {
    if (isNil(object1) || isNil(object2)) {
      return isNil(object1) && isNil(object2)
    }

    if (!!identifier) {
      return object1[identifier] === object2[identifier]
    }

    if (this.hasEqualsMethod(object1)) {
      ;(object1 as unknown as Record<'equals', (other: T) => boolean>).equals(
        object2,
      )
    }
    isEqual(object1, object2)
  }

  static hasEqualsMethod(object: any) {
    return Object.keys(object).includes('equals')
  }

  static everyEquals<T>(objects1: T[], objects2: T[]): boolean {
    if (objects1.length !== objects2.length) {
      return false
    }

    return objects1.every((o1) =>
      objects2.some((o2) => ObjectUtils.equals(o1, o2)),
    )
  }

  static hasKey(object: any, key: string) {
    return Object.prototype.hasOwnProperty.call(object, key)
  }

  static isClass(object: any) {
    return object?.toString()?.substring(0, 5) === 'class'
  }
}

export default ObjectUtils
