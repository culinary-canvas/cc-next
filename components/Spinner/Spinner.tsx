import React, { CSSProperties } from 'react'
import './Spinner.module.scss'
import {ICON, IconSizeType} from '../../styles/icon'
import {COLOR, ColorType} from '../../styles/color'

interface Props {
  size?: IconSizeType
  color?: ColorType
  className?: string
  style?: CSSProperties
}

export function Spinner(props: Props) {
  const { size = ICON.SIZE.M, color: backgroundColor = COLOR.BLACK } = props
  const width = `${size / 3}px`
  const height = `${size / 3}px`
  const containerWidth = `${size}px`

  return (
    <span className="container spinner" style={{ width: containerWidth }}>
      <span className="dot" style={{ backgroundColor, width, height }} />
      <span className="dot" style={{ backgroundColor, width, height }} />
      <span className="dot" style={{ backgroundColor, width, height }} />
    </span>
  )
}
