import { createContext, useCallback, useContext, useState } from 'react'

export interface Overlay {
  readonly isVisible: boolean
  readonly setVisible: (v: boolean) => void
  readonly text: string
  readonly setText: (v: string) => void
  readonly progress: number
  readonly setProgress: (v: number) => void
  readonly addProgress: (v: number) => void
  readonly toggle: () => void
}

export function useOverlayState(): Overlay {
  const [isVisible, setVisible] = useState<boolean>(false)
  const [text, setText] = useState<string>()
  const [progress, setProgress] = useState<number>()

  const toggle = useCallback(() => {
    setVisible(!isVisible)
    if (isVisible) {
      document.querySelector('body').classList.add('no-scroll')
    } else {
      document.querySelector('body').classList.remove('no-scroll')
    }
  }, [isVisible])

  const addProgress = useCallback((v: number) => setProgress(progress + v), [progress])

  return {
    isVisible,
    setVisible,
    text,
    setText,
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
