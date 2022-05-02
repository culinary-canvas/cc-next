import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Logo from '../../public/assets/culinary-canvas-logo-mark.svg'
import { classnames } from '../services/importHelpers'
import { MenuButton } from './button/MenuButton'
import s from './MobileMenu.module.scss'

interface Props {
  className?: string
  buttonClassName?: string
  collapsed: boolean
}

export function MobileMenu(props: Props) {
  const { className, buttonClassName, collapsed } = props
  const router = useRouter()

  const [open, setOpen] = useState<boolean>(false)
  const [first, setFirst] = useState<boolean>(true)

  useEffect(() => {
    function handleRouteChangeStart(url) {
      setOpen(false)
    }
    if (!!router) {
      router.events.on('routeChangeStart', handleRouteChangeStart)
    }
    return () => {
      if (!!router) {
        router.events.off('routeChangeStart', handleRouteChangeStart)
      }
    }
  }, [router])

  useEffect(() => {
    if (open) {
      document.querySelector('body').classList.add('no-scroll')
    } else {
      document.querySelector('body').classList.remove('no-scroll')
    }
  }, [open])

  return (
    <div className={s.container}>
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
      <MenuButton
        open={open}
        onClick={() => {
          setOpen(!open)
          setFirst(false)
        }}
        className={classnames(
          s.button,
          {
            [s.open]: open,
          },
          buttonClassName,
        )}
      />

      <div
        className={classnames(s.backdrop, {
          [s.open]: open,
          [s.close]: !open && !first,
        })}
      />

      <div
        className={classnames(
          s.dropdown,
          { [s.open]: open, [s.close]: !open && !first },
          className,
        )}
      >
        <Link href="/articles">
          <a
            className={classNames(
              router.asPath.startsWith('/articles') && s.active,
            )}
          >
            Articles
          </a>
        </Link>

        <Link href="/index">
          <a
            className={classNames(
              router.asPath.startsWith('/index') && s.active,
            )}
          >
            Index
          </a>
        </Link>

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
    </div>
  )
}
