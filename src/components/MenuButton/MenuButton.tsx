import React, { CSSProperties } from 'react'
import s from './MenuButton.module.scss'
import {classnames} from '../../services/importHelpers'

interface Props {
  onClick: () => any
  className?: string
  style?: CSSProperties
  isOpen?: boolean
}

export function MenuButton(props: Props) {
  const { onClick, className, style, isOpen = false } = props
  return (
    <button
      className={classnames([
        s.menuButton,
        { [s.isOpen]: isOpen },
        className,
      ])}
      style={style}
      aria-label="Menu button"
      onClick={() => onClick()}
    >
      <span className={s.bar} />
      <span className={s.bar} />
      <span className={s.bar} />
    </button>
  )
}
