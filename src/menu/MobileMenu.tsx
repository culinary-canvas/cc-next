import React, { useEffect, useState } from 'react'
import s from './MobileMenu.module.scss'
import Link from 'next/link'
import { menuOptions } from './menuOptions'
import { useMenu } from './Menu.context'
import { classnames } from '../services/importHelpers'
import { MenuButton } from './button/MenuButton'
import { useRouter } from 'next/router'

interface Props {
  className?: string
  buttonClassName?: string
}

export function MobileMenu(props: Props) {
  const { className, buttonClassName } = props
  const { activeMenuOption } = useMenu()
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
    <>
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
          s.container,
          { [s.open]: open, [s.close]: !open && !first },
          className,
        )}
      >
        {Object.values(menuOptions).map((option) =>
          !!option.subMenu ? (
            <div className={s.optionWithSubMenu} key={option.href}>
              <Link key={option.href} href={option.href}>
                <a
                  className={classnames({
                    [s.active]: option.equals(activeMenuOption),
                  })}
                >
                  {option.text}
                </a>
              </Link>
              <div className={s.subMenu}>
                {option.subMenu.map((subOption) => (
                  <Link key={subOption.href} href={subOption.href}>
                    <a
                      className={classnames({
                        [s.active]: subOption.equals(activeMenuOption),
                      })}
                    >
                      {subOption.text}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={option.href} href={option.href}>
              <a
                className={classnames({
                  [s.active]: option.equals(activeMenuOption),
                })}
              >
                {option.text}
              </a>
            </Link>
          ),
        )}
      </div>
    </>
  )
}
