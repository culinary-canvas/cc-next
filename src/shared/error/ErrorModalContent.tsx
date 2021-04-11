import React from 'react'
import s from './ErrorModalContent.module.scss'
import { Button } from '../button/Button'

interface Props {
  message: string
  onClose: () => void
}

export function ErrorModalContent(props: Props) {
  const { message, onClose } = props
  return (
    <div className={s.container}>
      <h2>Error</h2>
      <p>{message}</p>
      <Button onClick={() => onClose()}>Close</Button>
    </div>
  )
}
