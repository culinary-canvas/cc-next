import type { AppProps } from 'next/app'

import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { authService } from '../services/auth/Auth.service'
import classnames from 'classnames'
import Modal from 'react-modal'
import { AppContext, AppEnvironment } from '../services/AppEnvironment'
import { CookieBanner } from '../components/CookieBanner/CookieBanner'
import { Overlay } from '../components/Overlay/Overlay'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import AdminSidebar from '../components/AdminSidebar/AdminSidebar'
import { when } from 'mobx'
import TagManager from 'react-gtm-module'

Modal.setAppElement('#__next')

const App = observer(({ Component, pageProps }: AppProps) => {
  const [env, setEnv] = useState<AppEnvironment>()

  useEffect(() => {
    // TODO
    // TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
  }, [])

  useEffect(() => {
    if (!env) {
      const env = new AppEnvironment()
      Promise.all([env.init(), when(() => authService.initialized)]).then(() =>
        setEnv(env),
      )
    }
  }, [env])

  if (!env) {
    return null
  }

  return (
    <AppContext.Provider value={env}>
      <CookieBanner />
      {env.overlayStore.isVisible && (
        <Overlay
          text={env.overlayStore.text}
          progress={env.overlayStore.progress}
        />
      )}

      {!!authService.isSignedIn && env.adminSidebarStore.shouldRender && (
        <AdminSidebar />
      )}

      <div
        id="app"
        className={classnames({
          'showing-sidebar':
            env.adminSidebarStore.shouldRender && env.adminSidebarStore.isOpen,
        })}
      >
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AppContext.Provider>
  )
})

export default App
