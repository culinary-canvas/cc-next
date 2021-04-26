import { createContext, useCallback, useContext, useState } from 'react'

export interface Overlay {
  readonly isVisible: boolean
  readonly text: string
  readonly setText: (v:string) => void
  readonly progress: number
  readonly setProgress: (value: number, text?: string) => void
  readonly addProgress: (v: number) => void
  readonly children: any
  readonly setChildren: (children: any) => void
  readonly toggle: (v?: boolean) => void
  readonly reset: () => void
}

export function useOverlayState(): Overlay {
  const [isVisible, _setVisible] = useState<boolean>(false)
  const [text, setText] = useState<string>()
  const [progress, _setProgress] = useState<number>()
  const [children, _setChildren] = useState<any>()

  const reset = useCallback(() => {
    setText(null)
    setProgress(null)
    _setChildren(null)
    _setVisible(false)
  }, [])

  const setChildren = useCallback((v: any) => {
    reset()
    _setChildren(v)
  }, [])

  const setProgress = useCallback((v: number, t?: string) => {
    _setChildren(null)
    _setProgress(v)
    !!t && setText(t)
  }, [])

  const toggle = useCallback(
    (v = !isVisible) => {
      _setVisible(v)
      if (v) {
        document.querySelector('body').classList.add('no-scroll')
      } else {
        document.querySelector('body').classList.remove('no-scroll')
      }
    },
    [isVisible],
  )

  const addProgress = useCallback((v: number) => _setProgress(progress + v), [
    progress,
  ])

  return {
    isVisible,
    text,
    setText,
    progress,
    setProgress,
    addProgress,
    toggle,
    children,
    setChildren,
    reset,
  }
}

export const OverlayContext = createContext<Overlay>(null)

export function useOverlay(): Overlay {
  const context = useContext(OverlayContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Overlay context')
  }
  return context
}
