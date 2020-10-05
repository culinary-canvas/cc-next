import 'reflect-metadata'

export interface TransformProperties<T> {
  toApp: (obj: any) => T
  toDb: (obj: T) => any
}

export function transform<T>(
  transformers: TransformProperties<T>,
): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata(
      'transform',
      { toApp: transformers.toApp, toDb: transformers.toDb },
      target,
      key,
    )
  }
}

export function hasTransform<T>(target: T, key: string): boolean {
  return Reflect.hasMetadata('transform', target, key)
}

export function getTransform<T>(
  target: T,
  key: string,
): TransformProperties<T> {
  return Reflect.getMetadata('transform', target, key)
}
