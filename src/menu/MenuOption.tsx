import React, { CSSProperties, useEffect, useState } from 'react'
import { classnames } from '../services/importHelpers'
import s from './MenuOption.module.scss'
import { useRouter } from 'next/router'
import { animated } from 'react-spring'
import { MenuOptionDefinition } from './MenuOptionDefinition'
import { useMenu } from './useMenu'

interface Props {
  definition: MenuOptionDefinition
  onClick?: (def: MenuOptionDefinition) => any
  onHover: (def: MenuOptionDefinition) => void
  onBlur: () => void
  currentHoveredOption: MenuOptionDefinition
  isLoading?: boolean
  style: CSSProperties
  show: boolean
  onRender: (ref: HTMLButtonElement) => void
  className?: string
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
    show,
    onRender,
    className,
  } = props

  const router = useRouter()
  const { active } = useMenu()
  const [isActive, setActive] = useState<boolean>(false)

  useEffect(() => setActive(active?.name === definition.name), [
    active,
    definition,
  ])

  return (
    <animated.button
      style={{ ...style, display: show ? 'initial' : 'none' }}
      ref={(ref) => onRender(ref)}
      className={classnames(
        s.button,
        {
          [s.admin]: definition.isAdmin,
          [s.hideOnMobile]: definition.hideOnMobile,
          [s.otherHovered]:
            !!currentHoveredOption &&
            currentHoveredOption.name !== definition.name,
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
