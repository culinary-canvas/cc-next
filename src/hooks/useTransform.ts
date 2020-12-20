import { useMemo } from 'react'
import { Transformer } from '../services/db/Transformer'
import { Class } from '../types/Class'

export function useTransform<T = any>(
  dbObjects: any[] = [],
  Clazz: Class<T>,
): T[] {
  return useMemo<T[]>(
    () =>
      dbObjects.filter((o) => !!o).map((o) => Transformer.dbToModel(o, Clazz)),
    [dbObjects],
  )
}
