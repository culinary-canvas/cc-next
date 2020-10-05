import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import classnames from 'classnames'
import Modal from 'react-modal'
import { AppContext, AppEnvironment } from '../services/AppEnvironment'
import { CookieBanner } from '../components/CookieBanner/CookieBanner'
import { Overlay } from '../components/Overlay/Overlay'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import AdminSidebar from '../components/AdminSidebar/AdminSidebar'
import { Auth, AuthContext } from '../services/auth/Auth'

interface Props extends AppProps {
  env: AppEnvironment
  auth: Auth
}

Modal.setAppElement('#__next')

function App({ Component, pageProps, env, auth }: Props) {
  useEffect(() => {
    // TODO
    // TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
  }, [])

  return (
    <AppContext.Provider value={env}>
      <AuthContext.Provider value={auth}>
        <CookieBanner />
        {env.overlayStore.isVisible && (
          <Overlay
            text={env.overlayStore.text}
            progress={env.overlayStore.progress}
          />
        )}

        {!!auth.isSignedIn && env.adminSidebarStore.shouldRender && (
          <AdminSidebar />
        )}

        <div
          id="app"
          className={classnames({
            'showing-sidebar':
              env.adminSidebarStore.shouldRender &&
              env.adminSidebarStore.isOpen,
          })}
        >
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </AuthContext.Provider>
    </AppContext.Provider>
  )
}

App.getInitialProps = async (ctx) => {
  const env = new AppEnvironment()
  await env.init()

  const auth = new Auth()
  auth.init()

  return { env, auth }
}

export default App
