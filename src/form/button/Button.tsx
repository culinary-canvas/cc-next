import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { Spinner } from '../../shared/spinner/Spinner'
import { classnames } from '../../services/importHelpers'
import { COLOR, ColorType } from '../../styles/color'
import s from './Button.module.scss'

export interface ButtonProps
  extends React.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean
  loadingText?: string
  color?: ColorType | string
  circle?: boolean
  toggleable?: boolean
  selected?: boolean
  unsetStyle?: boolean
  className?: string
  title?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      children,
      color = COLOR.BLACK,
      toggleable = false,
      selected,
      loading = false,
      loadingText,
      disabled = false,
      onClick,
      style,
      className,
      unsetStyle = false,
      circle = false,
      title,
      ...restProps
    } = props

    return (
      <button
        ref={ref}
        onClick={(e) => !disabled && !!onClick && onClick(e)}
        style={{
          borderColor: color,
          color,
          ...style,
        }}
        className={classnames([
          s.button,
          className,
          { [s.unsetStyle]: unsetStyle },
          { [s.circle]: circle },
          { [s.disabled]: disabled },
          { [s.toggleable]: toggleable },
          { [s.selected]: selected },
        ])}
        title={title}
        {...restProps}
        disabled={disabled}
      >
        {loading ? (
          <>
            {loadingText}
            <Spinner color={color} />
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)
