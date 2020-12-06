import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../services/auth/Auth'
import { animated, useSpring, useTrail } from 'react-spring'
import s from './MobileMenu.module.scss'
import { useMenu } from './useMenu'
import MenuOption from './MenuOption'
import { MenuButton } from './MenuButton'
import { MenuOptionDefinition } from './MenuOptionDefinition'

export function MobileMenu() {
  const router = useRouter()
  const auth = useAuth()
  const { options, active } = useMenu()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [hoveringOption, setHoveringOption] = useState<MenuOptionDefinition>()
  const [isOpen, setOpen] = useState<boolean>(false)
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const [isAnimatedIn, setAnimatedIn] = useState<boolean>(false)
  const [optionRefs] = useState<Map<string, HTMLButtonElement>>(new Map())

  const [containerAnimation, setContainerAnimation] = useSpring(() => ({
    width: 32,
    height: 32,
    config: { mass: 10, tension: 280, friction: 5, clamp: true },
  }))

  const [optionsAnimations, setOptionsAnimations] = useTrail<{
    opacity: number
  }>(options.length, () => ({
    opacity: 0,
  }))

  const [activeMarkerAnimation, setActiveMarkerAnimation] = useSpring(() => ({
    height: 0,
    width: 0,
    left: 0,
    top: 0,
    config: { mass: 1, tension: 480, friction: 50, clamp: false },
  }))

  const open = useCallback(async () => {
    setOpen(true)
    setShowOptions(true)
    await new Promise((r) =>
      setContainerAnimation({
        width: window.innerWidth - 32,
        height: window.innerHeight - 32,
        onRest: () => r(),
      }),
    )
    let c = 0
    setOptionsAnimations({
      opacity: 1,
      onRest: () => {
        c++
        if (c === options.length - 2) {
          setAnimatedIn(true)
        }
      },
    })
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
      setContainerAnimation({ width: 32, height: 32, onRest: () => r() }),
    )
    setAnimatedIn(false)
    setShowOptions(false)
  }, [setOpen, options])

  const animateMarker = useCallback(
    async (activeRef: HTMLButtonElement) => {
      if (activeMarkerAnimation.top.getValue() === 0) {
        await new Promise((r) =>
          setActiveMarkerAnimation({
            left: activeRef.offsetLeft + 10,
            top: activeRef.offsetTop + 16,
            width: activeRef.offsetWidth - 20,
            onRest: () => r(),
          }),
        )
      }
      setActiveMarkerAnimation({
        height: 12,
        left: activeRef.offsetLeft + 10,
        top: activeRef.offsetTop + 16,
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
    <animated.nav style={{ ...containerAnimation }} className={s.menu}>
      {optionsAnimations.map((animationProps, i) => {
        const definition = options[i]
        return (
          <MenuOption
            className={s.option}
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
        barThickness={2}
      />
    </animated.nav>
  )
}
