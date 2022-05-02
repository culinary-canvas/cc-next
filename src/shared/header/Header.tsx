import React, { useEffect, useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { Menu } from '../../menu/Menu'
import { MobileMenu } from '../../menu/MobileMenu'
import { isServer } from '../../pages/_app'
import { useAuth } from '../../services/auth/Auth'
import { classnames } from '../../services/importHelpers'
import { ClientRender } from '../ClientRender/ClientRender'
import s from './Header.module.scss'

export const Header = () => {
  const { isSignedIn } = useAuth()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [collapsing, setCollapsing] = useState<boolean>(false)
  useEffect(() => {
    function onScroll(e) {
      if (!collapsing) {
        if (window.scrollY > 250) {
          if (!collapsed) {
            setCollapsing(true)
            setTimeout(() => setCollapsing(false), 600)
          }
          setCollapsed(true)
        } else {
          if (collapsed) {
            setCollapsing(true)
            setTimeout(() => setCollapsing(false), 600)
          }
          setCollapsed(false)
        }
      }
    }
    if (!isServer) {
      window.addEventListener('scroll', onScroll)
    }
    return () => window.removeEventListener('scroll', onScroll)
  }, [isServer, collapsing, collapsed])

  return (
    <header
      className={classnames(
        s.container,
        collapsed && s.collapsed,
        isSignedIn && s.isSignedIn,
      )}
    >
      <BrowserView>
        <Menu className={classnames(s.menu, s.desktop)} collapsed={collapsed} />
      </BrowserView>
      <MobileView>
        <MobileMenu
          collapsed={collapsed}
          className={classnames(s.menu, s.mobile)}
          buttonClassName={classnames(s.mobile, s.mobileButton)}
        />
      </MobileView>
    </header>
  )
}
