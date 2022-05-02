import React, { CSSProperties } from 'react'
import s from './Spinner.module.scss'
import { ICON, IconSizeType } from '../../styles/_icon'
import { COLOR, ColorType } from '../../styles/_color'
import { classnames } from '../../services/importHelpers'

interface Props {
  size?: IconSizeType
  color?: ColorType
  className?: string
  style?: CSSProperties
}

export function Spinner(props: Props) {
  const {
    size = ICON.SIZE.M,
    color: backgroundColor = COLOR.BLACK,
    className,
  } = props
  const width = `${size / 3}px`
  const height = `${size / 3}px`
  const containerWidth = `${size}px`

  return (
    <div
      className={classnames(s.container, className)}
      style={{ width: containerWidth }}
    >
      <span className={s.dot} style={{ backgroundColor, width, height }} />
      <span className={s.dot} style={{ backgroundColor, width, height }} />
      <span className={s.dot} style={{ backgroundColor, width, height }} />
    </div>
  )
}
