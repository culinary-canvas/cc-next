import React, { forwardRef, useRef } from 'react'
import { useObserver } from 'mobx-react'
import './Checkbox.module.scss'
import { v1 as uuid } from 'uuid'
import {classnames} from '../../services/importHelpers'

interface Props {
  checked: boolean
  onChange: (value: boolean) => any
  label?: string
  containerClassName?: string
  disabled?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    checked,
    onChange,
    label,
    containerClassName,
    disabled = false,
  } = props
  const id = useRef(uuid()).current

  return useObserver(() => (
    <span className={classnames('checkbox', containerClassName)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />
      <label htmlFor={id} style={{ opacity: disabled ? 0.6 : 1 }}>
        {label}
      </label>
    </span>
  ))
})

Checkbox.displayName = 'Checkbox'
