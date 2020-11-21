import React from 'react'
import s from './GridModal.module.scss'
import { Button } from '../../../../../../../form/button/Button'

interface Props {
  title: string
  message: string
  onOk: () => any
  onCancel: () => any
}

export function GridModal({ title, message, onOk, onCancel }: Props) {
  return (
    <div className={s.background}>
      <div className={s.container}>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className={s.buttons}>
          <Button onClick={() => onCancel()}>Cancel</Button>
          <Button onClick={() => onOk()}>OK</Button>
        </div>
      </div>
    </div>
  )
}
