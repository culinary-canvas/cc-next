import React, { forwardRef, useEffect, useState } from 'react'

interface Props {
  id?: string
  value: any
  options: readonly any[]
  onChange: (value: any) => any
  displayFormatter?: (value: any) => any
  valueGetter?: (value: any) => any
  showEmptyOption?: boolean
  disabled?: boolean
  onFocus?: () => any
  className?: string
}

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const {
    id,
    value,
    options,
    onChange,
    displayFormatter,
    valueGetter,
    showEmptyOption = false,
    disabled = false,
    onFocus,
    className,
  } = props

  const [numeric, setNumeric] = useState<boolean>(false)

  useEffect(() => {
    setNumeric(options.every((o) => isFinite(Number(o))))
  }, [options])

  const _onChange = (v) => {
    onChange(numeric ? Number(v) : v)
  }

  return (
    <select
      ref={ref}
      id={id}
      onBlur={(e) =>
        _onChange(e.target.value === 'None' ? undefined : e.target.value)
      }
      onChange={(e) =>
        _onChange(e.target.value === 'None' ? undefined : e.target.value)
      }
      onFocus={() => !!onFocus && onFocus()}
      value={value}
      disabled={disabled}
      className={className}
    >
      {showEmptyOption && <option value="None">- None -</option>}

      {options.map((option) => (
        <option
          key={!!valueGetter ? valueGetter(option) : option}
          value={!!valueGetter ? valueGetter(option) : option}
        >
          {!!displayFormatter ? displayFormatter(option) : option}
        </option>
      ))}
    </select>
  )
})

Select.displayName = 'Select'
