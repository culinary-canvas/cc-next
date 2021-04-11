import { Class } from '../../types/Class'
import 'reflect-metadata'

export interface FieldProperties<T> {
  type?: Class<T>
}

export function field<T>(type?: Class<T>): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata('field', { type }, target, key)
  }
}

export function isField<T>(target: T, key: string): boolean {
  return Reflect.hasMetadata('field', target, key)
}

export function getField<T>(target: T, key: string): FieldProperties<T> {
  return Reflect.getMetadata('field', target, key)
}
