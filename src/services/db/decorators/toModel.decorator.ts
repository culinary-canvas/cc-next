import 'reflect-metadata'
import { Class } from '../../../types/Class'

export function toModel(): MethodDecorator {
  return function (target, key) {
    Reflect.defineMetadata('toModel', true, target, key)
  }
}

export function hasToModel<T>(target: Class): boolean {
  return Object.getOwnPropertyNames(target).reduce((has, key) => {
    if (!has) {
      return Reflect.getMetadataKeys(target, key).includes('toModel')
    }
    return has
  }, false)
}

export function getToModel<T>(target: Class<T>): (obj: any) => T {
  const transformMethod = Object.getOwnPropertyNames(target).find((key) =>
    Reflect.hasMetadata('toModel', target, key),
  )
  return target[transformMethod]
}
