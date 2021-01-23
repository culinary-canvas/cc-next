import React from 'react'
import { classnames } from '../../services/importHelpers'
import s from './MenuButton.module.scss'

interface Props {
  onClick: () => any
  open: boolean
  className?: string
}

export function MenuButton(props: Props) {
  const { onClick, open, className } = props

  return (
    <button
      onClick={() => onClick()}
      className={classnames(s.button, { [s.open]: open }, className)}
    >
      <span />
      <span />
      <span />
    </button>
  )
}
