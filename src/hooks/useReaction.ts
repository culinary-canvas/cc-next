import { IReactionDisposer, IReactionOptions, reaction } from 'mobx'
import { useEffect, useRef } from 'react'
import { useUnmount } from './useUnmount'

export function useReaction<T = any>(
  predicate: () => T,
  action: (arg: T) => any,
  deps = [],
  options?: IReactionOptions<T>,
) {
  const disposer = useRef<IReactionDisposer>()

  useEffect(() => {
    !!disposer.current && disposer.current()
    disposer.current = reaction(predicate, (data) => action(data), options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useUnmount(() => {
    !!disposer.current && disposer.current()
  })
}
