import 'reflect-metadata'

export function transformToDb(): MethodDecorator {
  return function (target, key) {
    Reflect.defineMetadata('transformToDb', true, target, key)
  }
}

export function hasTransformToDb<T>(target: T): boolean {
  return Object.getOwnPropertyNames(target.constructor).reduce((has, key) => {
    if (!has) {
      return Reflect.getMetadataKeys(target.constructor, key).includes(
        'transformToDb',
      )
    }
    return has
  }, false)
}

export function getTransformToDb<T>(target: T): (obj: T) => any {
  const transformMethod = Object.getOwnPropertyNames(
    target.constructor,
  ).find((key) => Reflect.hasMetadata('transformToDb', target.constructor, key))
  return target.constructor[transformMethod]
}
