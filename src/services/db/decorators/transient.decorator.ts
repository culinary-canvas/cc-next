import 'reflect-metadata'

/**
 * This annotation is only for verbosity when defining classes. Could be removed, or used to automate 'popluate' methods
 */

export function transient(): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata('transient', true, target, key)
  }
}

export function isTransient<T>(target: T, key: keyof T): boolean {
  return Reflect.hasMetadata('transient', target, key as string)
}
