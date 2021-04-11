import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import classnames from 'classnames'
import Modal from 'react-modal'
import '../styles/global.scss'
import { AuthContext, useAuthState } from '../services/auth/Auth'
import TagManager from 'react-gtm-module'
import { AdminContext, useAdminState } from '../admin/Admin.context'
import { OverlayContext, useOverlayState } from '../shared/overlay/OverlayStore'
import {
  ImageModalContext,
  useImageModalState,
} from '../image/imageModal/ImageModal.store'
import { Overlay } from '../shared/overlay/Overlay'
import { CookieBanner } from '../shared/cookieBanner/CookieBanner'
import ArticleFormSidebar from '../article/form/sidebar/ArticleFormSidebar'
import { Header } from '../shared/header/Header'
import { Footer } from '../shared/footer/Footer'
import { enableStaticRendering } from 'mobx-react'
import { RouteTransition } from '../shared/routeTransition/RouteTransition'
import { MenuContext, useMenuState } from '../menu/Menu.context'

export const isServer = typeof window === 'undefined'
export const IS_PROD = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

Modal.setAppElement('#__next')
enableStaticRendering(isServer)

interface Props extends AppProps {}

function App({ Component, pageProps }: Props) {
  useEffect(() => {
    if (IS_PROD) {
      TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
    }
  }, [])

  const admin = useAdminState()
  const overlay = useOverlayState()
  const menu = useMenuState()
  const imageModalValues = useImageModalState()
  const auth = useAuthState()

  useEffect(() => {
    auth.init()
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      <MenuContext.Provider value={menu}>
        <ImageModalContext.Provider value={imageModalValues}>
          <AdminContext.Provider value={admin}>
            <OverlayContext.Provider value={overlay}>
              <RouteTransition />

              {IS_PROD && <CookieBanner />}

              {overlay.isVisible && (
                <Overlay
                  text={overlay.text}
                  progress={overlay.progress}
                  children={overlay.children}
                />
              )}

              {auth.isSignedIn && admin.sidebar && <ArticleFormSidebar />}

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
        </ImageModalContext.Provider>
      </MenuContext.Provider>
    </AuthContext.Provider>
  )
}

App.getStaticProps = async () => {
  if (isServer) {
    return {}
  }
}

export default App
