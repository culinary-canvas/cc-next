import React from 'react'
import s from './Modal.module.scss'
import { Button } from '../../form/button/Button'
import { classnames } from '../../services/importHelpers'

interface Props {
  title?: string
  message?: string
  onOk?: () => any
  onCancel?: () => any
  dark?: boolean
  children?: any
}

export function Modal({
  title,
  message,
  onOk,
  onCancel,
  dark = false,
  children,
}: Props) {
  return (
    <div className={classnames(s.background, { [s.dark]: dark })}>
      <div className={s.container}>
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
