import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../services/auth/Auth'
import { animated, useSpring, useTrail } from 'react-spring'
import s from './DesktopMenu.module.scss'
import { useMenu } from './useMenu'
import MenuOption from './MenuOption'
import { MenuButton } from './MenuButton'
import { MenuOptionDefinition } from './MenuOptionDefinition'

export function DesktopMenu() {
  const router = useRouter()
  const auth = useAuth()
  const { options, active } = useMenu()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [hoveringOption, setHoveringOption] = useState<MenuOptionDefinition>()
  const [isOpen, setOpen] = useState<boolean>(false)
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const [isAnimatedIn, setAnimatedIn] = useState<boolean>(false)
  const [optionRefs, setOptionRefs] = useState<Map<string, HTMLButtonElement>>(
    new Map(),
  )

  const [containerAnimation, setContainerAnimation] = useSpring(() => ({
    width: 48,
    config: { mass: 10, tension: 280, friction: 5, clamp: true },
  }))

  const [optionsAnimations, setOptionsAnimations] = useTrail<{
    opacity: number
  }>(options.length, () => ({
    opacity: 0,
  }))

  const [activeMarkerAnimation, setActiveMarkerAnimation] = useSpring(() => ({
    left: 0,
    width: 0,
    height: 0,
    config: { mass: 1, tension: 480, friction: 50, clamp: false },
  }))

  const open = useCallback(async () => {
    setOpen(true)
    setShowOptions(true)
    await new Promise((r) =>
      setContainerAnimation({
        width: auth.isSignedIn ? 700 : 370,
        onRest: () => r(),
      }),
    )
    await new Promise((r) => {
      let c = 0
      setOptionsAnimations({
        opacity: 1,
        onRest: (a) => {
          c++
          if (c === options.length - 1) {
            r()
          }
        },
      })
    })
    setAnimatedIn(true)
  }, [options])

  const close = useCallback(async () => {
    setOpen(false)
    await Promise.all([
      new Promise((r) => {
        let i = 0
        setOptionsAnimations({
          opacity: 0,
          onRest: () => {
            i++
            if (i === options.length - 2) {
              r()
            }
          },
        })
      }),
      new Promise((r) =>
        setActiveMarkerAnimation({
          height: 0,
          onRest: () => r(),
        }),
      ),
    ])
    setActiveMarkerAnimation({ height: 0 })
    await new Promise((r) =>
      setContainerAnimation({ width: 48, onRest: () => r() }),
    )
    setAnimatedIn(false)
    setShowOptions(false)
  }, [setOpen, options])

  const animateMarker = useCallback(
    async (activeRef: HTMLButtonElement) => {
      if (activeMarkerAnimation.left.getValue() === 0) {
        await new Promise((r) =>
          setActiveMarkerAnimation({
            left: activeRef.offsetLeft + 10,
            width: activeRef.offsetWidth - 20,
            onRest: () => r(),
          }),
        )
      }
      setActiveMarkerAnimation({
        height: 10,
        left: activeRef.offsetLeft + 10,
        width: activeRef.offsetWidth - 20,
      })
    },
    [activeMarkerAnimation],
  )

  useEffect(() => {
    if (isAnimatedIn && !!active) {
      animateMarker(optionRefs.get(active.name))
    }
  }, [active, optionRefs, isAnimatedIn])

  return (
    <animated.nav
      style={{
        width: containerAnimation.width,
      }}
      className={s.menu}
    >
      {optionsAnimations.map((animationProps, i) => {
        const definition = options[i]
        return (
          <MenuOption
            key={i}
            style={animationProps}
            show={showOptions}
            definition={definition}
            onHover={(v) => setHoveringOption(v)}
            onBlur={() => setHoveringOption(null)}
            currentHoveredOption={hoveringOption}
            onRender={(ref) => optionRefs.set(definition.name, ref)}
            onClick={async (def) => {
              animateMarker(optionRefs.get(def.name))
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
          ...activeMarkerAnimation,
        }}
      />

      <MenuButton
        onClick={() => {
          !isOpen ? open() : close()
        }}
        isOpen={isOpen}
        className={s.menuButton}
        showArrows={(!isOpen && !isAnimatedIn) || (isOpen && isAnimatedIn)}
      />
    </animated.nav>
  )
}
