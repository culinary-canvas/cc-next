import 'reflect-metadata'
import { Class } from '../../../types/Class'

export function transformToApp(): MethodDecorator {
  return function (target, key) {
    Reflect.defineMetadata('transformToApp', true, target, key)
  }
}

export function hasTransformToApp<T>(target: Class<T>): boolean {
  return Object.getOwnPropertyNames(target).reduce((has, key) => {
    if (!has) {
      return Reflect.getMetadataKeys(target, key).includes('transformToApp')
    }
    return has
  }, false)
}

export function getTransformToApp<T>(target: Class<T>): (obj: any) => T {
  const transformMethod = Object.getOwnPropertyNames(target).find((key) =>
    Reflect.hasMetadata('transformToApp', target, key),
  )
  return target[transformMethod]
}
