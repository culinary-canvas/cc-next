import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../services/auth/Auth'
import { animated } from 'react-spring'
import s from './DesktopMenu.module.scss'
import MenuOption from './MenuOption'
import { MenuButton } from './MenuButton'
import { useMenu } from './useMenu'

export function DesktopMenu() {
  const router = useRouter()
  const auth = useAuth()
  const {
    options,
    open,
    close,
    containerAnimations,
    optionsAnimations,
    markerAnimations,
    addOptionElementRef,
    moveMarker,
  } = useMenu()

  const [isLoading, setLoading] = useState<boolean>(false)
  const [isOpen, setOpen] = useState<boolean>(false)
  const [showArrows, setShowArrows] = useState<boolean>(false)

  return (
    <animated.nav
      style={{ ...containerAnimations }}
      className={s.menu}
      onMouseLeave={() => setShowArrows(true)}
    >
      {optionsAnimations.map((animationProps, i) => {
        const definition = options[i]
        return (
          <MenuOption
            key={i}
            style={animationProps}
            show={isOpen}
            definition={definition}
            onRender={(ref) => addOptionElementRef(definition.name, ref)}
            onClick={async (def) => {
              moveMarker(def.name)
              if (definition.name === 'signOut') {
                setLoading(true)
                await auth.signOut()
                router.push('/')
              }
            }}
            isLoading={isLoading}
          />
        )
      })}

      <animated.span
        className={s.activeMarker}
        style={{
          ...markerAnimations,
        }}
      />

      <MenuButton
        onClick={async () => {
          if (!isOpen) {
            setOpen(true)
            await open()
          } else {
            await close()
            setOpen(false)
          }
          setShowArrows(false)
        }}
        isOpen={isOpen}
        className={s.menuButton}
        showArrows={showArrows}
      />
    </animated.nav>
  )
}
