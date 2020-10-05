import 'reflect-metadata'

export function transient(): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata('transient', true, target, key)
  }
}

export function isTransient<T>(target: T, key: keyof T): boolean {
  return Reflect.hasMetadata('transient', target, key as string)
}
