import 'reflect-metadata'

export interface CollectionProperties {
  name: string
}

export function collection(name?: string): ClassDecorator {
  return function <T extends Function>(target) {
    Reflect.defineMetadata('collection', { name }, target)
  }
}

export function isCollection<T>(target: T): boolean {
  return Reflect.hasMetadata('collection', target.constructor)
}

export function getCollection<T>(target: T): CollectionProperties {
  return Reflect.getMetadata('collection', target.constructor)
}
