import React from 'react'
import { Button } from '../../../../../../../form/button/Button'
import s from './HeightButtons.module.scss'
import { Size } from '../../../../../../../article/shared/format/Size'

interface Props {
  selected: Size
  onSelected: (v: Size) => any
}

export function HeightButtons(props: Props) {
  const { selected, onSelected } = props

  return (
    <>
      <label htmlFor="section-height">Height</label>

      <div id="section-height" className={s.container}>
        <Button
          toggleable
          onClick={() => onSelected(Size.FIT_CONTENT)}
          selected={selected === Size.FIT_CONTENT}
          className={s.button}
        >
          Fit content
        </Button>

        <Button
          toggleable
          onClick={() => onSelected(Size.FULL_SCREEN)}
          selected={selected === Size.FULL_SCREEN}
          className={s.button}
        >
          Full screen
        </Button>
      </div>
    </>
  )
}
