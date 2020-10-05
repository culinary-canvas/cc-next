import ObjectUtils from './ObjectUtils'

export class ArrayUtils {
  static areDifferent<T>(a1: T[], a2: T[]) {
    return this.someNotIncluded(a1, a2) || this.someNotIncluded(a2, a1)
  }

  static areEqual<T>(a1: T[], a2: T[]) {
    return !this.someNotIncluded(a1, a2) && !this.someNotIncluded(a2, a1)
  }

  static someNotIncluded<T>(array: T[], arrayToLookIn: T[]) {
    return array.some(
      o1 =>
        !arrayToLookIn.some(o2 => {
          return ObjectUtils.equals(o1, o2)
        }),
    )
  }

  static asArray(target: any | any[]) {
    return Array.isArray(target) ? target : [target]
  }

  static distinct(a1: any[], a2: any[]) {
    const distinct = [...a1]

    a2.filter(
      o2 => !distinct.some(o1 => ObjectUtils.equals(o2, o1)),
    ).forEach(o2 => distinct.push(o2))

    return distinct
  }
}
