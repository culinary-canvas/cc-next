import React from 'react'
import { classnames } from '../../services/importHelpers'
import { COLOR } from '../../styles/color'
import { Button } from '../../form/button/Button'
import s from './Tag.module.scss'

interface Props {
  tag: string
  onClick?: () => any
  selected?: boolean
  backgroundColor?: string
}

export function Tag(props: Props) {
  const { tag, onClick, selected = true, backgroundColor = COLOR.GREY_LIGHT } = props

  return (
    <Button
      key={tag}
      onClick={(e) => {
        e.preventDefault()
        onClick && onClick()
      }}
      className={classnames(s.tag, { [s.selected]: selected })}
      color={selected ? COLOR.BLACK : COLOR.GREY_DARK}
      style={{
        color: selected ? COLOR.BLACK : COLOR.GREY_DARK,
        backgroundColor,
      }}
    >
      {tag}
    </Button>
  )
}
