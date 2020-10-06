import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import Modal from 'react-modal'
import '../styles/global.scss'
import {
  AppContext,
  AppEnvironment,
  SerializedAppEnvironment,
} from '../services/AppEnvironment'
import { CookieBanner } from '../components/CookieBanner/CookieBanner'
import { Overlay } from '../components/Overlay/Overlay'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import AdminSidebar from '../components/AdminSidebar/AdminSidebar'
import { Auth, AuthContext } from '../services/auth/Auth'
import { useStaticRendering } from 'mobx-react-lite'

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
    setHydratedAuth(new Auth(auth))
  }, [env])

  if (!hydratedEnv || !hydratedAuth) {
    return null
  }
  return (
    <AppContext.Provider value={hydratedEnv}>
      <AuthContext.Provider value={hydratedAuth}>
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

let appEnvironment: AppEnvironment

App.getInitialProps = async (ctx) => {
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
