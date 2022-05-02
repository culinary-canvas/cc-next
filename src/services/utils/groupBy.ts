import { get } from 'lodash'

export function groupBy<T extends object>(
  objects: T[],
  key: keyof T,
): Map<string, T[]> {
  return objects.reduce<Map<string, T[]>>((mapped, object) => {
    const value = get(object, key) as unknown as string
    const array = mapped.get(value) ?? []
    array.push(object)
    mapped.set(value, array)
    return mapped
  }, new Map<string, T[]>())
}
