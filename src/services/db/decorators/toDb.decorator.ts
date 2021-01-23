import 'reflect-metadata'
import { DocumentData } from '@firebase/firestore-types'

export function toDb(): MethodDecorator {
  return function (target, key) {
    Reflect.defineMetadata('toDb', true, target, key)
  }
}

export function hasToDb(target: any): boolean {
  return Object.getOwnPropertyNames(target.constructor).reduce((has, key) => {
    if (!has) {
      return Reflect.getMetadataKeys(target.constructor, key).includes('toDb')
    }
    return has
  }, false)
}

export function getToDb<T>(target: T): (obj: T) => DocumentData {
  const transformMethod = Object.getOwnPropertyNames(
    target.constructor,
  ).find((key) =>
    Reflect.hasMetadata('toDb', target.constructor, key),
  )
  return target.constructor[transformMethod]
}
