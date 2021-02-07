import ObjectUtils from './ObjectUtils'
import { isNil } from '../importHelpers'

export class ArrayUtils {
  static areDifferent<T>(a1: T[], a2: T[]) {
    return this.someNotIncluded(a1, a2) || this.someNotIncluded(a2, a1)
  }

  static areEqual<T>(a1: T[], a2: T[]) {
    return !this.someNotIncluded(a1, a2) && !this.someNotIncluded(a2, a1)
  }

  static someNotIncluded<T>(array: T[], arrayToLookIn: T[]) {
    return array.some(
      (o1) =>
        !arrayToLookIn.some((o2) => {
          return ObjectUtils.equals(o1, o2)
        }),
    )
  }

  static asArray<T = any>(target: T | T[]): T[] {
    return Array.isArray(target) ? target : !isNil(target) ? [target] : []
  }

  static distinct(array: any[], identifier?: string): any[] {
    return array.reduce(
      (distinct, o) =>
        distinct.some((d) => ObjectUtils.equals(o, d, identifier))
          ? distinct
          : [...distinct, o],
      [],
    )
  }

  static distinctUnion(a1: any[], a2: any[]) {
    const distinct = [...a1]

    a2.filter(
      (o2) => !distinct.some((o1) => ObjectUtils.equals(o2, o1)),
    ).forEach((o2) => distinct.push(o2))

    return distinct
  }

  static min(array: number[]) {
    return (
      !!array && array.reduce((min, current) => (current < min ? current : min))
    )
  }

  static max(array: number[]) {
    return (
      !!array && array.reduce((max, current) => (current > max ? current : max))
    )
  }

  static numbered(length: number, base = 0): number[] {
    return Array.from(Array(length), (_, i) => base + i)
  }

  static numberedFrom(entries: any[]): number[] {
    return entries.map((_, i) => i + 1)
  }
}
