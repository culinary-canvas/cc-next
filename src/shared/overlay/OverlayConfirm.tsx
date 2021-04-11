import React, { useEffect, useRef } from 'react'
import { Button } from '../button/Button'
import s from './OverlayConfirm.module.scss'
import { useOverlay } from './OverlayStore'
import { DomUtils } from '../../services/utils/DomUtils'

interface Props {
  title?: string
  message?: string
  children?: any
  onCancel?: () => any
  onOk: () => any
}

export function OverlayConfirm({
  title,
  message,
  children,
  onCancel,
  onOk,
}: Props) {
  const overlay = useOverlay()
  const id = useRef('overlay-confirm').current
  const buttonsId = useRef('overlay-confirm-buttons').current

  useEffect(() => {
    function clickListener(e: MouseEvent) {
      if (
        overlay.isVisible &&
        !DomUtils.hasIdOrParentWithId(e.target as HTMLElement, [id, buttonsId])
      ) {
        overlay.toggle(false)
      }
    }

    window.addEventListener('mousedown', clickListener)
    return () => window.removeEventListener('mousedown', clickListener)
  }, [])

  return (
    <div className={s.container} id={id}>
      {!!title && <h1>{title}</h1>}
      {!!message && <p>{message}</p>}
      {!!children && children}
      <div className={s.buttons} id={buttonsId}>
        <Button
          onClick={() => {
            overlay.toggle(false)
            !!onCancel && onCancel()
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            overlay.toggle(false)
            onOk()
          }}
        >
          OK
        </Button>
      </div>
    </div>
  )
}
