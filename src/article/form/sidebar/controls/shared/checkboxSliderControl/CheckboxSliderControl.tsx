import React from 'react'
import { Checkbox } from '../../../../../../shared/checkbox/Checkbox'
import { isNil } from '../../../../../../services/importHelpers'
import { runInAction } from 'mobx'
import { Slider } from '../../../../../../shared/slider/Slider'

interface Props {
  value: number | null
  max: number
  label: string
  onChange: (v: number | null) => any
}

export function CheckboxSliderControl(props: Props) {
  const { value, max,label, onChange } = props

  return (
    <>
      <Checkbox
        checked={!isNil(value)}
        onChange={() => onChange(isNil(value) ? 800 : null)}
        label={label}
      />
      <Slider
        value={value}
        onChange={(v) => runInAction(() => onChange(v))}
        max={max}
        disabled={isNil(value)}
      />
    </>
  )
}
