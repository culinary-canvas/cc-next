import { useCallback, useEffect, useState } from 'react'
import { Transformer } from '../services/db/Transformer'
import { Class } from '../services/types/Class'

type Source = { [key: string]: any }

export function useTransformToModel<T>(source: Source, Clazz: Class<T>): T {
  const transform = useCallback(
    (source: Source) => {
      return !!source ? Transformer.dbToModel(source, Clazz) : null
    },
    [Clazz],
  )

  const [transformed, setTransformed] = useState<T>(transform(source))

  useEffect(() => {
    setTransformed(transform(source))
  }, [source])

  return transformed
}
