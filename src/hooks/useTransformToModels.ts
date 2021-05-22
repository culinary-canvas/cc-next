import { useCallback, useEffect, useState } from 'react'
import { Transformer } from '../services/db/Transformer'
import { Class } from '../services/types/Class'

type Source = { [key: string]: any }

export function useTransformToModels<T>(
  source: Source[],
  Clazz: Class<T>,
): T[] {
  const transform = useCallback(
    (source: Source[]) => {
      if (!!source && !!source.length) {
        return source
          .filter((o) => !!o)
          .map((o) => Transformer.dbToModel(o, Clazz))
      } else {
        return []
      }
    },
    [Clazz],
  )

  const [transformed, setTransformed] = useState<T[]>(transform(source))

  useEffect(() => {
    setTransformed(transform(source))
  }, [source])

  return transformed
}
