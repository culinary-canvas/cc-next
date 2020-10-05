import { useEffect } from 'react'

export function useUnmount(action: (...args: any[]) => any) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => action(), [])
}
