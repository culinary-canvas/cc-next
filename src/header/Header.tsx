import React, { useEffect, useState } from 'react'
import s from './Header.module.scss'
import Link from 'next/link'
import Logo from '../../public/assets/logo.svg'
import { useRouter } from 'next/router'
import { Menu } from '../menu/Menu'
import { isServer } from '../pages/_app'
import { classnames } from '../services/importHelpers'
import { BrowserView, MobileView } from 'react-device-detect'
import { MobileMenu } from '../menu/MobileMenu'

export const Header = () => {
  const router = useRouter()
  const [logoHovered, setLogoHovered] = useState<boolean>(false)
  const [collapsed, setCollapsed] = useState<boolean>(false)

  useEffect(() => {
    function onScroll() {
      if (window.pageYOffset > 100) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }
    if (!isServer) {
      window.addEventListener('scroll', onScroll)
    }
    return () => window.removeEventListener('scroll', onScroll)
  }, [collapsed, isServer])

  return (
    <header className={classnames(s.container, { [s.collapsed]: collapsed })}>
      <Link href="/" passHref>
        <a
          onClick={() => {
            router.push('/')
          }}
        >
          <img
            src={Logo}
            alt="Culinary Canvas"
            className={s.logo}
            title="Go to start"
          />
        </a>
      </Link>
      <Menu className={classnames(s.menu, s.desktop)} />
      <MobileMenu className={classnames(s.menu, s.mobile)} buttonClassName={classnames(s.mobile, s.mobileButton)}/>
    </header>
  )
}
