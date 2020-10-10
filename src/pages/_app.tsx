import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import Modal from 'react-modal'
import '../styles/global.scss'
import {
  AppContext,
  AppEnvironment,
  IS_DEV,
  SerializedAppEnvironment,
} from '../services/AppEnvironment'
import { CookieBanner } from '../components/CookieBanner/CookieBanner'
import { Overlay } from '../components/Overlay/Overlay'
import { Auth, AuthContext } from '../services/auth/Auth'
import { useObserver, useStaticRendering } from 'mobx-react-lite'
import AdminSidebar from '../components/AdminSidebar/AdminSidebar'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

interface Props extends AppProps {
  env: SerializedAppEnvironment
  auth: Auth
}

Modal.setAppElement('#__next')

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

function App({ Component, pageProps, env, auth }: Props) {
  useEffect(() => {
    // TODO
    // TagManager.initialize({ gtmId: 'GTM-5DF54SC' })
  }, [])

  const [hydratedEnv, setHydratedEnv] = useState<AppEnvironment>()
  const [hydratedAuth, setHydratedAuth] = useState<Auth>()

  useEffect(() => {
    setHydratedEnv(new AppEnvironment(env))

    let a = new Auth(auth)
    a.init()
    setHydratedAuth(a)
  }, [env])

  return useObserver(() => {
    if (!hydratedEnv || !hydratedAuth) {
      return null
    }

    return (
      <AppContext.Provider value={hydratedEnv}>
        <AuthContext.Provider value={hydratedAuth}>
          {!IS_DEV && <CookieBanner />}

          {hydratedEnv.overlayStore.isVisible && (
            <Overlay
              text={hydratedEnv.overlayStore.text}
              progress={hydratedEnv.overlayStore.progress}
            />
          )}
          {hydratedAuth.isSignedIn && hydratedEnv.adminStore.sidebar && (
            <AdminSidebar />
          )}

          <div
            id="app"
            className={classnames({
              'showing-sidebar': hydratedEnv.adminStore.sidebarOpen,
            })}
          >
            <Header />
            <Component {...pageProps} />
            <Footer />
          </div>
        </AuthContext.Provider>
      </AppContext.Provider>
    )
  })
}

let appEnvironment: AppEnvironment

App.getInitialProps = async () => {
  if (isServer || !appEnvironment) {
    const env = new AppEnvironment()
    await env.init()

    const auth = new Auth()
    auth.init()

    return {
      env,
      auth,
    }
  }
}

export default App
