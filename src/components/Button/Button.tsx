import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Spinner } from '../Spinner/Spinner'
import { Tooltip } from '../Tooltip/Tooltip'
import { v4 as uuid } from 'uuid'
import {classnames} from '../../services/importHelpers'
import {COLOR, ColorType} from '../../styles/color'

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
  tooltipText?: string
}

export const Button = observer((props: Props) => {
  const {
    children,
    color = COLOR.BLACK,
    toggleable = false,
    selected,
    tooltipText,
    loading = false,
    loadingText,
    disabled = false,
    onClick,
    style,
    className,
    unsetStyle = false,
    circle = false,
    ...restProps
  } = props

  const [tooltipId, setTooltipId] = useState<string>()

  useEffect(() => {
    if (!!tooltipText) {
      setTooltipId(uuid())
    }
  }, [tooltipText])

  return (
    <button
      onClick={(e) => !disabled && onClick(e)}
      style={{
        borderColor: color,
        color,
        ...style,
      }}
      className={classnames([
        'button',
        className,
        { 'unset-style': unsetStyle, circle },
        { disabled },
        { toggleable },
        { selected },
      ])}
      data-tip={tooltipText}
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
      <Tooltip id={tooltipId} />
    </button>
  )
})
