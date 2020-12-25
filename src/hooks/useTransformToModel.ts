import { useMemo } from 'react'
import { Transformer } from '../services/db/Transformer'
import { Class } from '../types/Class'

export function useTransformToModel<T = any>(
  dbObjects: { [key: string]: any }[] = [],
  Clazz: Class<T>,
): T[] {
  return useMemo<T[]>(
    () =>
      dbObjects.filter((o) => !!o).map((o) => Transformer.dbToModel(o, Clazz)),
    [dbObjects],
  )
}
