import React, { useCallback } from 'react'
import { useOverlay } from '../overlay/OverlayStore'
import { ErrorModalContent } from './ErrorModalContent'

export interface UseErrorModal {
  showError: (error: Error | string) => void
  hideError: () => void
}

export function useErrorModal(): UseErrorModal {
  const overlay = useOverlay()

  const hide = useCallback(() => overlay.toggle(false), [overlay])

  const show = useCallback(
    (error: Error | string) => {
      overlay.setChildren(
        <ErrorModalContent
          message={error instanceof Error ? error.message : error}
          onClose={() => hide()}
        />,
      )
      overlay.toggle(true)
    },
    [overlay, hide],
  )

  return { showError: show, hideError: hide }
}
