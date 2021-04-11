import React, { useState } from 'react'
import { COLOR, ColorType } from '../../styles/_color'
import { Button } from '../../shared/button/Button'
import s from './Tag.module.scss'

interface Props {
  tag: string
  onClick?: () => any
  color?: ColorType
  hoverColor?: ColorType
}

export function Tag(props: Props) {
  const {
    tag,
    onClick,
    color = COLOR.GREY_DARK,
    hoverColor = COLOR.PINK_DARK,
  } = props

  const [isHovered, setHovered] = useState<boolean>(false)

  return (
    <Button
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      key={tag}
      onClick={(e) => {
        e.preventDefault()
        onClick && onClick()
      }}
      className={s.tag}
      color={isHovered ? hoverColor : color}
    >
      {tag}
    </Button>
  )
}
