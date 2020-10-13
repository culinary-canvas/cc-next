import React, { ButtonHTMLAttributes } from 'react'
import { observer } from 'mobx-react'
import { Spinner } from '../../shared/spinner/Spinner'
import { classnames } from '../../services/importHelpers'
import { COLOR, ColorType } from '../../styles/color'
import s from './Button.module.scss'

interface Props
  extends React.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean
  loadingText?: string
  color?: ColorType
  circle?: boolean
  toggleable?: boolean
  selected?: boolean
  unsetStyle?: boolean
  className?: string
  title?: string
}

export const Button = observer((props: Props) => {
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
      onClick={(e) => !disabled && onClick(e)}
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
})
