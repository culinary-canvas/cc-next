import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import classnames from 'classnames'
import Modal from 'react-modal'
import '../styles/global.scss'
import { CookieBanner } from '../components/CookieBanner/CookieBanner'
import { Overlay } from '../components/Overlay/Overlay'
import { AuthContext, useAuthState } from '../services/auth/Auth'
import AdminSidebar from '../components/AdminSidebar/AdminSidebar'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { AdminContext, useAdminState } from '../services/admin/Admin.store'
import { OverlayContext, useOverlayState } from '../services/OverlayStore'
import { dateTimeService } from '../domain/DateTime/DateTime.service'
import {
  ImageModalContext,
  useImageModalState,
} from '../components/ImageModal/ImageModal.store'
import TagManager from 'react-gtm-module'

export const isServer = typeof window === 'undefined'
export const IS_PROD =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ||
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging' // TODO: Remove staging for when we launch!
Modal.setAppElement('#__next')

interface Props extends AppProps {}

function App({ Component, pageProps }: Props) {
  useEffect(() => {
    if (IS_PROD) {
      TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
    }
    if (!isServer) {
      dateTimeService.init()
    }
  }, [])

  const admin = useAdminState()
  const overlay = useOverlayState()
  const imageModalValues = useImageModalState()
  const auth = useAuthState()

  useEffect(() => {
    auth.init()
  }, [])

  return (
    <ImageModalContext.Provider value={imageModalValues}>
      <AuthContext.Provider value={auth}>
        <AdminContext.Provider value={admin}>
          <OverlayContext.Provider value={overlay}>
            {IS_PROD && <CookieBanner />}

            {overlay.isVisible && (
              <Overlay text={overlay.text} progress={overlay.progress} />
            )}
            {auth.isSignedIn && admin.sidebar && <AdminSidebar />}

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

App.getInitialProps = async () => {
  if (isServer) {
    dateTimeService.init()

    return {}
  }
}

export default App
