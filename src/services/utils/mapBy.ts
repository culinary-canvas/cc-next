import { get } from 'lodash'

export function mapBy<T extends object, P extends keyof T, V extends T[P]>(
  objects: T[],
  key: P,
): Map<V, T> {
  return objects.reduce<Map<V, T>>((mapped, object) => {
    const value: V = get(object, key)
    mapped.set(value, object)
    return mapped
  }, new Map<V, T>())
}
