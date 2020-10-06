import React, { CSSProperties } from 'react'
import styles from './MenuButton.module.scss'
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
        styles.menuButton,
        { [styles.isOpen]: isOpen },
        className,
      ])}
      style={style}
      aria-label="Menu button"
      onClick={() => onClick()}
    >
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </button>
  )
}
