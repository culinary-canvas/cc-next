import React, { CSSProperties, useEffect, useState } from 'react'
import { classnames } from '../services/importHelpers'
import s from './MenuOption.module.scss'
import { useRouter } from 'next/router'
import { animated, useSpring } from 'react-spring'
import { MenuOptionDefinition } from './MenuOptionDefinition'
import { useMenu } from './useMenu'
import { COLOR } from '../styles/color'

interface Props {
  definition: MenuOptionDefinition
  onClick?: (def: MenuOptionDefinition) => any
  onHover: (def: MenuOptionDefinition) => void
  onBlur: () => void
  currentHoveredOption: MenuOptionDefinition
  isLoading?: boolean
  style: CSSProperties
  onRender: (ref: HTMLButtonElement) => void
  className?: string
  show: boolean
}

export default function MenuOption(props: Props) {
  const {
    definition,
    onClick,
    onHover,
    onBlur,
    currentHoveredOption,
    isLoading = false,
    style,
    onRender,
    className,
    show,
  } = props

  const router = useRouter()
  const { active } = useMenu()
  const [isActive, setActive] = useState<boolean>(false)

  useEffect(() => setActive(active?.name === definition.name), [
    active,
    definition,
  ])

  const { color } = useSpring({
    color:
      !currentHoveredOption || currentHoveredOption.name === definition.name
        ? definition.isAdmin
          ? COLOR.BLUE
          : COLOR.BLACK
        : definition.isAdmin
        ? COLOR.BLUE_LIGHT
        : COLOR.GREY,
    config: { tension: 400 },
  })

  return (
    <animated.button
      style={{ ...style, color, display: show ? undefined : 'none' }}
      ref={(ref) => onRender(ref)}
      className={classnames(
        s.button,
        {
          [s.admin]: definition.isAdmin,
          [s.hideOnMobile]: definition.hideOnMobile,
        },
        className,
      )}
      onClick={(event) => {
        !!onClick && onClick(definition)
        !!definition.path && router.push(definition.path)
      }}
      onMouseOver={() => onHover(definition)}
      onMouseOut={() => onBlur()}
      disabled={isActive || isLoading}
    >
      <label>{definition.label}</label>
    </animated.button>
  )
}
