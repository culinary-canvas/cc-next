import { autorun, IReactionDisposer } from 'mobx'
import { useEffect, useRef } from 'react'
import { useUnmount } from './useUnmount'

export function useAutorun(action: () => any, deps: any[] = []) {
  const disposer = useRef<IReactionDisposer>()

  useEffect(() => {
    !!disposer.current && disposer.current()
    disposer.current = autorun(action)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps])

  useUnmount(() => {
    !!disposer.current && disposer.current()
  })
}
