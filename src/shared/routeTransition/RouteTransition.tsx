import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { classnames } from '../../services/importHelpers'
import s from './RouteTransition.module.scss'

export function RouteTransition() {
  const router = useRouter()
  const [routeChanging, setRouteChanging] = useState<boolean>(false)
  const [routeHasChanged, setRouteHasChanged] = useState<boolean>(false)
  const [currentRoute, setCurrentRoute] = useState<string>(router.pathname)
  const [animationInDoneTime, setAnimationInDoneTime] = useState<number>(0)

  useEffect(() => {
    function handleRouteChangeStart(url) {
      if (url !== currentRoute) {
        setAnimationInDoneTime(new Date().getTime() + 500)

        setRouteHasChanged(true)
        setCurrentRoute(url)
        setRouteChanging(true)
      }
    }
    async function handleRouteChangeComplete(url) {
      await new Promise<void>((resolve) => {
        const i = setInterval(() => {
          if (new Date().getTime() > animationInDoneTime) {
            resolve()
            console.log(i)
            clearInterval(i)
          }
        }, 100)
      })
      if (url === currentRoute) {
        setRouteChanging(false)
      }
    }
    if (!!router) {
      router.events.on('routeChangeStart', handleRouteChangeStart)
      router.events.on('routeChangeComplete', handleRouteChangeComplete)
    }
    return () => {
      if (!!router) {
        router.events.off('routeChangeStart', handleRouteChangeStart)
        router.events.off('routeChangeComplete', handleRouteChangeComplete)
      }
    }
  }, [router, routeChanging, currentRoute, animationInDoneTime])

  return (
    <div
      className={classnames(s.routeChangeSplash, {
        [s.animateIn]: routeChanging,
        [s.animateOut]: routeHasChanged && !routeChanging,
      })}
    />
  )
}
