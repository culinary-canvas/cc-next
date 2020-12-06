import { useMemo } from 'react'
import { Transformer } from '../services/db/Transformer'
import { Class } from '../types/Class'

export function useTransform<T = any>(
  dbObjects: Partial<T>[] = [],
  Clazz: Class<T>,
): T[] {
  return useMemo<T[]>(
    () => dbObjects.filter((o) => !!o).map((o) => Transformer.toApp(o, Clazz)),
    [dbObjects],
  )
}
