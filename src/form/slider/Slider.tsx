import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { v1 as uuid } from 'uuid'
import s from './Slider.module.scss'
import ReactSlider from 'react-slider'
import { classnames } from '../../services/importHelpers'

interface Props {
  label?: string
  value: number
  onChange: (v: number) => any
  min?: number
  max?: number
  disabled?: boolean
  id?: string
  containerClassName?: string
  children?: any
  step?: number
}

export const Slider = observer((props: Props) => {
  const {
    label,
    value,
    onChange,
    min,
    max,
    disabled,
    id,
    containerClassName,
    children,
    step,
  } = props

  const uid = useRef(uuid())
  const [inputWidth, setInputWidth] = useState<number>(4)

  useEffect(() => {
    if (max) {
      if (max < 10) {
        setInputWidth(1.5)
      } else if (max < 100) {
        setInputWidth(2.5)
      } else if (max < 1000) {
        setInputWidth(3.5)
      }
    }
  }, [max])

  return (
    <div className={classnames(s.container, containerClassName)}>
      {label && <label htmlFor={uid.current}>{label}</label>}

      <ReactSlider
        className={s.slider}
        thumbClassName={classnames(s.thumb, { [s.disabledThumb]: disabled })}
        trackClassName={s.track}
        value={value}
        min={min}
        max={max}
        onChange={(v) => onChange(v)}
        disabled={disabled}
        id={id}
        step={step}
      />

      <input
        id={uid.current}
        value={value}
        type="number"
        onChange={(v) => {
          let inputValue = Number(v.target.value)
          if (inputValue <= max && inputValue >= min) {
            onChange(inputValue)
          }
        }}
        min={min}
        max={max}
        style={{ width: `${inputWidth}rem` }}
        className={classnames({ [s.disabledInput]: disabled })}
      />
      {children}
    </div>
  )
})
