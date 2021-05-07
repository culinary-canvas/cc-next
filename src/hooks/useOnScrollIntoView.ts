import { useCallback, useEffect, useState } from 'react'
import { isNil } from '../services/importHelpers'

export function useOnScrollIntoView(
  referenceElement: HTMLElement,
  onReached: () => any,
  deps: any[] = [],
  options?: { relativeOffset?: number; fixedOffset?: number },
) {
  const [relative, setRelative] = useState<number>(1)
  const [fixed, setFixed] = useState<number>(options?.fixedOffset)
  const [reached, setReached] = useState<boolean>(false)

  const evaluate = useCallback(() => {
    if (!!referenceElement && !reached) {
      const threshold = !isNil(relative)
        ? referenceElement.offsetTop * relative
        : referenceElement.offsetTop - fixed
      if (window.pageYOffset > threshold) {
        setReached(true)
        onReached()
      }
    }
  }, [reached, referenceElement, onReached])

  useEffect(() => {
    setRelative(!isNil(options?.relativeOffset) ? options.relativeOffset : 1)
    setFixed(options?.fixedOffset)
  }, [options])

  useEffect(() => {
    evaluate()
  }, [referenceElement])

  useEffect(() => {
    window.addEventListener('scroll', evaluate, { passive: true })
    return () => window.removeEventListener('scroll', evaluate)
  }, [reached, onReached, referenceElement, evaluate, ...deps])
}
