import { MutableRefObject, useEffect, useRef, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export function useMeasure<T extends Element>(): [
  ref: MutableRefObject<T>,
  bounds: Partial<DOMRectReadOnly>,
] {
  const ref = useRef<T>()
  const [bounds, set] = useState<Partial<DOMRectReadOnly>>()
  const [resizeObserver] = useState<ResizeObserver>(
    () =>
      new ResizeObserver(([entry]) => {
        set(entry.contentRect)
      }),
  )

  useEffect(() => {
    !!ref.current && resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  return [ref, bounds]
}
