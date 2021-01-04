import { createContext, useCallback, useContext, useState } from 'react'

export interface Overlay {
  readonly isVisible: boolean
  readonly setVisible: (v: boolean) => void
  readonly text: string
  readonly progress: number
  readonly setProgress: (value: number, text?: string) => void
  readonly addProgress: (v: number) => void
  readonly toggle: () => void
}

export function useOverlayState(): Overlay {
  const [isVisible, setVisible] = useState<boolean>(false)
  const [text, setText] = useState<string>()
  const [progress, _setProgress] = useState<number>()

  const setProgress = useCallback((v: number, t?: string) => {
    _setProgress(v)
    !!t && setText(t)
  }, [])

  const toggle = useCallback(() => {
    setVisible(!isVisible)
    if (isVisible) {
      document.querySelector('body').classList.add('no-scroll')
    } else {
      document.querySelector('body').classList.remove('no-scroll')
    }
  }, [isVisible])

  const addProgress = useCallback((v: number) => _setProgress(progress + v), [
    progress,
  ])

  return {
    isVisible,
    setVisible,
    text,
    progress,
    setProgress,
    addProgress,
    toggle,
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
