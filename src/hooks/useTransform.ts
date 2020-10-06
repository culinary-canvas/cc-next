import { useMemo } from 'react'
import { DbTransformService } from '../services/db/DbTransform.service'
import { Class } from '../types/Class'

export function useTransform<T = any>(
  dbObjects: Partial<T>[],
  Clazz: Class<T>,
): T[] {
  return useMemo<T[]>(() => {
    return dbObjects.map((o) => DbTransformService.transformToApp(o, Clazz))
  }, [dbObjects])
}
