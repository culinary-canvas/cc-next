import React, { CSSProperties, useEffect, useState } from 'react'
import s from './Modal.module.scss'
import { Button } from '../button/Button'
import { classnames, isNil } from '../../services/importHelpers'

interface Props {
  title?: string
  message?: string
  onOk?: () => any
  onCancel?: () => any
  dark?: boolean
  children?: any
  style?: CSSProperties
  y?: number
}

export function Modal({
  title,
  message,
  onOk,
  onCancel,
  dark = false,
  children,
  style = {},
  y,
}: Props) {
  const [position, setPosition] = useState<CSSProperties>({})
  useEffect(() => {
    if (!isNil(y)) {
      setPosition({ position: 'fixed', top: y })
    }
  }, [y])

  return (
    <div className={classnames(s.background, { [s.dark]: dark })}>
      <div className={s.container} style={{ ...position, ...style }}>
        {!!title && <h4>{title}</h4>}
        {!!message && <p>{message}</p>}
        {!!children && children}
        <div className={s.buttons}>
          {!!onCancel && <Button onClick={() => onCancel()}>Cancel</Button>}
          {!!onOk && <Button onClick={() => onOk()}>OK</Button>}
        </div>
      </div>
    </div>
  )
}
