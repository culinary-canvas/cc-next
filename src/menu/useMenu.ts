import { AnimatedValue, useSpring, useTrail } from 'react-spring'
import {
  createContext,
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { isMobile } from 'react-device-detect'
import { MenuOptionDefinition } from './MenuOptionDefinition'
import { useRouter } from 'next/router'
import StringUtils from '../services/utils/StringUtils'
import { menuOptions } from './useMenuOptions'
import { useAuth } from '../services/auth/Auth'

interface MenuParams {
  options: MenuOptionDefinition[]
  active: MenuOptionDefinition
  containerAnimations: AnimatedValue<CSSProperties>
  optionsAnimations: CSSProperties[]
  markerAnimations: AnimatedValue<CSSProperties>
  open: () => Promise<void>
  close: () => Promise<void>
  addOptionElementRef: (name: string, el: HTMLButtonElement) => void
  moveMarker: (name: string) => Promise<void>
}

export function useMenuState(): MenuParams {
  const _router = useRouter()
  const _auth = useAuth()

  const _height = useRef(isMobile ? 32 : 48).current
  const _expandedHeight = useRef(isMobile ? window.innerHeight - 32 : 48)
    .current
  const _width = useRef(isMobile ? 32 : 48).current
  const [_expandedWidth, _setExpandedWidth] = useState(
    isMobile ? window.innerWidth - 32 : _auth.isSignedIn ? 700 : 370,
  )
  useEffect(
    () =>
      _setExpandedWidth(
        isMobile ? window.innerWidth - 32 : _auth.isSignedIn ? 700 : 370,
      ),
    [_auth.isSignedIn],
  )

  const [active, _setActive] = useState<MenuOptionDefinition>()
  const [options, _setOptions] = useState<MenuOptionDefinition[]>([])
  const [optionElementRefs] = useState<Map<string, HTMLButtonElement>>(
    new Map(),
  )
  const addOptionElementRef = useCallback(
    (name: string, el: HTMLButtonElement) => optionElementRefs.set(name, el),
    [optionElementRefs],
  )

  useEffect(() => {
    _setOptions(
      menuOptions.filter(
        (o) =>
          !o.isAdmin || (_auth.isSignedIn && (!isMobile || !o.hideOnMobile)),
      ),
    )
  }, [_auth.isSignedIn, isMobile])

  useEffect(() => {
    _setActive(
      menuOptions.find((o) =>
        !!o.articleType
          ? _router.query.type === StringUtils.toLowerKebabCase(o.articleType)
          : o.path === _router.pathname,
      ),
    )
  }, [_router, _router.query, _router.pathname])

  const [containerAnimations, _setContainerAnimation] = useSpring(() => ({
    width: _width,
    height: _height,
    config: {
      mass: 1,
      tension: 300,
      friction: 35,
    },
  }))

  const [optionsAnimations, _setOptionsAnimations] = useTrail<{
    opacity: number
  }>(options.length, () => ({
    opacity: 0,
    config: {
      tension: 300,
      friction: 35,
    },
  }))

  const markerAnimationConfig = useRef({ tension: 300, friction: 30 }).current
  const [markerAnimations, _setMarkerAnimation] = useSpring(() => {
    return {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
      config: markerAnimationConfig,
    }
  })

  const moveMarker = useCallback(
    async (activeName = active.name) => {
      const activeRef = optionElementRefs.get(activeName)
      if (markerAnimations.top.getValue() === 0) {
        await new Promise<void>((r) =>
          _setMarkerAnimation({
            left: activeRef.offsetLeft + 10,
            top: activeRef.offsetTop + 16,
            width: activeRef.offsetWidth - 20,
            onRest: () => r(),
            // @ts-ignore
            config: { duration: 0 },
          }),
        )
      }
      _setMarkerAnimation({
        height: 8,
        left: activeRef.offsetLeft + 10,
        top: activeRef.offsetTop + 20,
        width: activeRef.offsetWidth - 20,
        onRest: () => null,
        config: markerAnimationConfig,
      })
    },
    [markerAnimations, optionElementRefs, active],
  )

  const open = useCallback(async () => {
    await new Promise<void>((r) =>
      _setContainerAnimation({
        width: _expandedWidth,
        onRest: () => null,
        // @ts-ignore
        onFrame: (ds) => ds.width >= _expandedWidth * 0.8 && r(),
      }),
    )
    if (_expandedHeight !== _height) {
      await new Promise<void>((r) =>
        _setContainerAnimation({
          height: _expandedHeight,
          // @ts-ignore
          onFrame: (ds) => {
            if (ds.height >= _expandedHeight) {
              r()
            }
          },
        }),
      )
    }
    let i = 0
    await new Promise<void>((r) =>
      _setOptionsAnimations({
        opacity: 1,
        onRest: () => {
          options[i].name === active?.name && r()
          i++
        },
      }),
    )

    moveMarker()
  }, [options, active])

  const close = useCallback(async () => {
    _setMarkerAnimation({
      height: 0,
      config: markerAnimationConfig,
    })

    let i = 0
    await new Promise<void>((r) =>
      _setOptionsAnimations({
        opacity: 0,
        onRest: () => {
          i++
          i >= options.length / 2 && r()
        },
      }),
    )
    await new Promise<void>((r) =>
      _setContainerAnimation({
        height: _height,
        onRest: () => null,
        // @ts-ignore
        onFrame: (ds) => ds.height <= _height * 1.2 && r(),
      }),
    )

    _setContainerAnimation({
      width: _width,
      // @ts-ignore
      onFrame: () => null,
    })
  }, [options])

  return {
    active,
    open,
    close,
    options,
    addOptionElementRef,
    containerAnimations,
    markerAnimations,
    optionsAnimations,
    moveMarker,
  }
}

export const MenuContext = createContext<MenuParams>(null)

export function useMenu(): MenuParams {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Menu context')
  }
  return context
}
