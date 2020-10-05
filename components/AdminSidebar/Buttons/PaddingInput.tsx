import React from 'react'
import { observer } from 'mobx-react'
import './PaddingInput.module.scss'
import { Slider } from '../../Slider/Slider'
import { PaddingLinkedButton } from './PaddingLinkedButton'
import {Padding} from '../../../domain/Format/Padding'

interface Props {
  padding: Padding
  onChange: (p: Padding) => any
}

export const PaddingInput = observer((props: Props) => {
  const { padding, onChange } = props

  const max = 200

  return (
    <div className="padding-input-container">
      <Slider
        label="Top"
        value={padding.top}
        onChange={(v) => {
          padding.setValue('top', v)
          onChange(padding)
        }}
        min={0}
        max={max}
        step={4}
      >
        <PaddingLinkedButton property="top" padding={padding} />
      </Slider>
      <Slider
        label="Bottom"
        value={padding.bottom || 0}
        onChange={(v) => {
          padding.setValue('bottom', v)
          onChange(padding)
        }}
        min={0}
        max={max}
        step={4}
      >
        <PaddingLinkedButton property="bottom" padding={padding} />
      </Slider>
      <Slider
        label="Right"
        value={padding.right || 0}
        onChange={(v) => {
          padding.setValue('right', v)
          onChange(padding)
        }}
        min={0}
        max={max}
        step={4}
      >
        <PaddingLinkedButton property="right" padding={padding} />
      </Slider>
      <Slider
        label="Left"
        value={padding.left || 0}
        onChange={(v) => {
          padding.setValue('left', v)
          onChange(padding)
        }}
        min={0}
        max={max}
        step={4}
      >
        <PaddingLinkedButton property="left" padding={padding} />
      </Slider>
    </div>
  )
})
