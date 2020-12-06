import React, { CSSProperties, useCallback } from 'react'
import s from './MenuButton.module.scss'
import { classnames } from '../services/importHelpers'
import { animated, useSpring } from 'react-spring'

interface Props {
  onClick: () => any
  className?: string
  style?: CSSProperties
  isOpen?: boolean
  showArrows?: boolean
  barThickness?: number
}

export function MenuButton(props: Props) {
  const {
    onClick,
    className,
    style,
    isOpen = false,
    showArrows = false,
    barThickness = 3,
  } = props

  const [bar1Anim, setBar1Anim] = useSpring(() => ({
    transform: 'translateX(0%) translateY(0%) rotateZ(0deg)',
    width: '75%',
    config: { tension: 200, velocity: 70, clamp: true },
  }))

  const [bar2Anim, setBar2Anim] = useSpring(() => ({
    transform: 'translateX(0%) translateY(0%) rotateZ(0deg)',
    width: '100%',
    config: { tension: 200, velocity: 70, clamp: true },
  }))

  const animateNormal = useCallback(() => {
    setBar1Anim({
      transform: 'translateX(0%) translateY(0%) rotateZ(0deg)',
      width: '75%',
    })
    setBar2Anim({
      transform: 'translateX(0%) translateY(0%) rotateZ(0deg)',
      width: '100%',
    })
  }, [])

  const animateMinus = useCallback(() => {
    setBar1Anim({
      transform: 'translateX(0%) translateY(135%) rotateZ(0deg)',
      width: '75%',
    })
    setBar2Anim({
      transform: 'translateX(0%) translateY(-135%) rotateZ(0deg)',
      width: '75%',
    })
  }, [])

  const animateArrowLeft = useCallback(() => {
    setBar1Anim({
      transform: 'translateX(33%) translateY(-25%) rotateZ(-45deg)',
      width: '50%',
    })
    setBar2Anim({
      transform: 'translateX(33%) translateY(25%) rotateZ(45deg)',
      width: '50%',
    })
  }, [])

  const animateArrowRight = useCallback(() => {
    setBar1Anim({
      transform: 'translateX(33%) translateY(-25%) rotateZ(45deg)',
      width: '50%',
    })
    setBar2Anim({
      transform: 'translateX(33%) translateY(25%) rotateZ(-45deg)',
      width: '50%',
    })
  }, [])

  return (
    <button
      className={classnames(s.menuButton, className)}
      style={{
        ...style,
      }}
      aria-label="Menu button"
      onClick={() => {
        isOpen ? animateNormal() : animateMinus()
        onClick()
      }}
      onMouseEnter={() =>
        showArrows && (isOpen ? animateArrowRight() : animateArrowLeft())
      }
      onMouseLeave={() => (isOpen ? animateMinus() : animateNormal())}
    >
      <animated.span
        className={s.bar}
        style={{ height: barThickness, ...bar1Anim }}
      />
      <animated.span
        className={s.bar}
        style={{ height: barThickness, ...bar2Anim }}
      />
    </button>
  )
}
