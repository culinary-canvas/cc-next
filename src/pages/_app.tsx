import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import Modal from 'react-modal'
import '../styles/global.scss'
import { AuthContext, useAuthState } from '../services/auth/Auth'
import TagManager from 'react-gtm-module'
import { AdminContext, useAdminState } from '../admin/Admin'
import { OverlayContext, useOverlayState } from '../shared/overlay/OverlayStore'
import {
  ImageModalContext,
  useImageModalState,
} from '../form/imageModal/ImageModal.store'
import { Overlay } from '../shared/overlay/Overlay'
import { CookieBanner } from '../shared/cookieBanner/CookieBanner'
import ArticleFormSidebar from '../admin/article/form/sidebar/ArticleFormSidebar'
import { Header } from '../header/Header'
import { Footer } from '../footer/Footer'
import { useStaticRendering } from 'mobx-react'
import { useRouter } from 'next/router'

export const isServer = typeof window === 'undefined'
export const IS_PROD = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

Modal.setAppElement('#__next')
useStaticRendering(isServer)

interface Props extends AppProps {}

function App({ Component, pageProps }: Props) {
  useEffect(() => {
    if (IS_PROD) {
      TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
    }
  }, [])

  const admin = useAdminState()
  const overlay = useOverlayState()
  const imageModalValues = useImageModalState()
  const auth = useAuthState()

  useEffect(() => {
    auth.init()
  }, [])

  const router = useRouter()
  const [routeChanging, setRouteChanging] = useState<boolean>(false)
  const [routeHasChanged, setRouteHasChanged] = useState<boolean>(false)
  const [currentRoute, setCurrentRoute] = useState<string>(router.pathname)

  useEffect(() => {
    function handleRouteChangeStart(url, { shallow }) {
      if (url !== currentRoute) {
        setRouteHasChanged(true)
        setCurrentRoute(url)
        setRouteChanging(true)
      }
    }
    function handleRouteChangeComplete(url, { shallow }) {
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
  }, [router, routeChanging, currentRoute])

  return (
    <ImageModalContext.Provider value={imageModalValues}>
      <AuthContext.Provider value={auth}>
        <AdminContext.Provider value={admin}>
          <OverlayContext.Provider value={overlay}>
            {IS_PROD && <CookieBanner />}

            {overlay.isVisible && (
              <Overlay text={overlay.text} progress={overlay.progress} children={overlay.children}/>
            )}
            {auth.isSignedIn && admin.sidebar && <ArticleFormSidebar />}
            <div
              className={classnames('route-change-splash', {
                'animate-in': routeChanging,
                'animate-out': routeHasChanged && !routeChanging,
              })}
            />

            <div
              id="app"
              className={classnames({
                'showing-sidebar': admin.sidebarOpen,
              })}
            >
              <Header />
              <Component {...pageProps} />
              <Footer />
            </div>
          </OverlayContext.Provider>
        </AdminContext.Provider>
      </AuthContext.Provider>
    </ImageModalContext.Provider>
  )
}

App.getStaticProps = async () => {
  if (isServer) {
    return {}
  }
}

export default App
