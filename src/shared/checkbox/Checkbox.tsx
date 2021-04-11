import React, { forwardRef } from 'react'
import s from './Checkbox.module.scss'
import { isString } from 'lodash'
import { v1 as uuid } from 'uuid'
import { classnames } from '../../services/importHelpers'

interface Props
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'onChange'
  > {
  checked: boolean
  onChange: (value: boolean) => any
  label?: string | any
  containerClassName?: string
  disabled?: boolean
  id?: string
}

export const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    checked,
    onChange,
    label,
    containerClassName,
    disabled = false,
    id = uuid(),
    ...restProps
  } = props

  return (
    <span className={classnames(s.checkbox, containerClassName)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
        {...restProps}
      />
      {isString(label) ? (
        <label htmlFor={id} style={{ opacity: disabled ? 0.6 : 1 }}>
          {label}
        </label>
      ) : (
        label
      )}
    </span>
  )
})

Checkbox.displayName = 'Checkbox'
