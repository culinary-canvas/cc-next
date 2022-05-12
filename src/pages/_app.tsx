import classnames from 'classnames'
import { enableStaticRendering } from 'mobx-react-lite'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import Modal from 'react-modal'
import { AdminContext, useAdminState } from '../admin/Admin.context'
import { AdminBar } from '../admin/adminBar/AdminBar'
import ArticleFormSidebar from '../article/form/sidebar/ArticleFormSidebar'
import {
  ImageModalContext,
  useImageModalState,
} from '../image/imageModal/ImageModal.store'
import { MenuContext, useMenuState } from '../menu/Menu.context'
import { AuthContext, useAuthState } from '../services/auth/Auth'
import { CookieBanner } from '../shared/cookieBanner/CookieBanner'
import { Footer } from '../shared/footer/Footer'
import { Header } from '../shared/header/Header'
import { HeaderContext, useHeaderState } from '../shared/header/Header.context'
import { Overlay } from '../shared/overlay/Overlay'
import { OverlayContext, useOverlayState } from '../shared/overlay/OverlayStore'
import { RouteTransition } from '../shared/routeTransition/RouteTransition'
import '../styles/global.scss'

export const isServer = typeof window === 'undefined'
export const IS_PROD = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

Modal.setAppElement('#__next')
enableStaticRendering(isServer)

type Props = AppProps

function App({ Component, pageProps }: Props) {
  useEffect(() => {
    if (IS_PROD) {
      TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
    }
  }, [])

  const admin = useAdminState()
  const overlay = useOverlayState()
  const menu = useMenuState()
  const header = useHeaderState()
  const imageModalValues = useImageModalState()
  const auth = useAuthState()

  useEffect(() => {
    auth.init()
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      <HeaderContext.Provider value={header}>
        <MenuContext.Provider value={menu}>
          <ImageModalContext.Provider value={imageModalValues}>
            <AdminContext.Provider value={admin}>
              <OverlayContext.Provider value={overlay}>
                <RouteTransition />

                {IS_PROD && <CookieBanner />}

                {overlay.isVisible && (
                  <Overlay text={overlay.text} progress={overlay.progress}>
                    {overlay.children}
                  </Overlay>
                )}

                {auth.isSignedIn && admin.sidebar && <ArticleFormSidebar />}

                <div
                  id="app"
                  className={classnames({
                    'showing-sidebar': admin.sidebarOpen,
                  })}
                >
                  <AdminBar />
                  <Header />
                  <Component {...pageProps} />
                  <Footer />
                </div>
              </OverlayContext.Provider>
            </AdminContext.Provider>
          </ImageModalContext.Provider>
        </MenuContext.Provider>
      </HeaderContext.Provider>
    </AuthContext.Provider>
  )
}

App.getStaticProps = async () => {
  if (isServer) {
    return {}
  }
}

export default App
