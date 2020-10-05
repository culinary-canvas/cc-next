import React, { forwardRef, useEffect, useState } from 'react'
import { useObserver } from 'mobx-react'

interface Props {
  id?: string
  value: any
  options: readonly any[]
  onChange: (value: any) => any
  displayFormatter?: (value: any) => any
  showEmptyOption?: boolean
  disabled?: boolean
}

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const {
    id,
    value,
    options,
    onChange,
    displayFormatter,
    showEmptyOption = false,
    disabled = false,
  } = props

  const [numeric, setNumeric] = useState<boolean>(false)

  useEffect(() => {
    setNumeric(options.every((o) => isFinite(Number(o))))
  }, [options])

  const _onChange = (v) => {
    onChange(numeric ? Number(v) : v)
  }

  return useObserver(() => (
    <select
      ref={ref}
      id={id}
      onBlur={(e) =>
        _onChange(e.target.value === 'None' ? undefined : e.target.value)
      }
      onChange={(e) =>
        _onChange(e.target.value === 'None' ? undefined : e.target.value)
      }
      value={value}
      disabled={disabled}
    >
      {showEmptyOption && <option value="None">None</option>}

      {options.map((option) => (
        <option key={option} value={option}>
          {!!displayFormatter ? displayFormatter(option) : option}
        </option>
      ))}
    </select>
  ))
})

Select.displayName = 'Select'
