import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Logo from '../../public/assets/culinary-canvas-logo-mark.svg'
import { classnames } from '../services/importHelpers'
import s from './Menu.module.scss'

interface Props {
  className?: string
  collapsed: boolean
}

export function Menu(props: Props) {
  const { className, collapsed } = props
  const router = useRouter()

  return (
    <nav className={classnames(s.container, className)}>
      <div className={s.leftMenu}>
        <Link href="/index">
          <a
            className={classNames(
              router.asPath.startsWith('/index') && s.active,
            )}
          >
            Index
          </a>
        </Link>

        <Link href="/articles">
          <a
            className={classNames(
              router.asPath.startsWith('/articles') && s.active,
            )}
          >
            Articles
          </a>
        </Link>
      </div>

      <button
        className={classNames(s.logoButton, collapsed && s.collapsed)}
        onClick={() => {
          router.push('/')
        }}
      >
        <Image
          src={Logo}
          alt="Culinary Canvas"
          // className={s.logo}
          title="Go to start"
          height={60}
          width={60}
        />
      </button>
      {/*<Menu className={classnames(s.menu, s.desktop)} />*/}
      <div className={s.rightMenu}>
        <Link href="/about">
          <a
            className={classNames(
              router.asPath.startsWith('/about') && s.active,
            )}
          >
            About
          </a>
        </Link>
      </div>
    </nav>
  )
}
