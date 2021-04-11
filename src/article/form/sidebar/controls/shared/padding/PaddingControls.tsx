import React from 'react'
import { observer } from 'mobx-react'
import s from './PaddingControls.module.scss'
import { Slider } from '../../../../../../shared/slider/Slider'
import { Padding } from '../../../../../models/Padding'
import { LinkedButton } from '../linkedButton/LinkedButton'

interface Props {
  padding: Padding
  onChange: (p: Padding) => any
}

export const PaddingControls = observer((props: Props) => {
  const { padding, onChange } = props

  const max = 200

  return (
    <div className={s.container}>
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
        <LinkedButton
          linked={padding.topLinked}
          onClick={() => padding.toggleLinked('top')}
        />
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
        <LinkedButton
          linked={padding.bottomLinked}
          onClick={() => padding.toggleLinked('bottom')}
        />
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
        <LinkedButton
          linked={padding.leftLinked}
          onClick={() => padding.toggleLinked('left')}
        />
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
        <LinkedButton
          linked={padding.rightLinked}
          onClick={() => padding.toggleLinked('right')}
        />
      </Slider>
    </div>
  )
})
