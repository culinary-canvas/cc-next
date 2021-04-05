import React, { useEffect, useRef, useState } from 'react'
import s from './Menu.module.scss'
import Link from 'next/link'
import { menuOptions } from './menuOptions'
import { useMenu } from './Menu.context'
import { classnames } from '../services/importHelpers'
import { useAuth } from '../services/auth/Auth'
import { MenuOption } from './MenuOption'

interface Props {
  className?: string
}

export function Menu(props: Props) {
  const { className } = props
  const { activeMenuOption } = useMenu()
  const auth = useAuth()

  const [activeSubMenu, setActiveSubMenu] = useState<MenuOption>()
  const [closeSubMenu, setCloseSubMenu] = useState<boolean>(false)
  const closeSubMenuTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (closeSubMenu) {
      closeSubMenuTimeout.current = setTimeout(() => {
        setCloseSubMenu(false)
        setActiveSubMenu(null)
      }, 1000)
    } else {
      if (closeSubMenuTimeout) {
        clearTimeout(closeSubMenuTimeout.current)
      }
    }
  }, [activeSubMenu, closeSubMenu])

  return (
    <div className={classnames(s.container, className)}>
      {Object.values(menuOptions).map((option) =>
        !!option.subMenu ? (
          <div
            className={s.optionWithSubMenu}
            onMouseOver={() => {
              setActiveSubMenu(option)
              setCloseSubMenu(false)
            }}
            onMouseOut={() => setCloseSubMenu(true)}
            key={option.href}
          >
            <Link href={option.href}>
              <a
                className={classnames({
                  [s.active]: option.equals(activeMenuOption),
                })}
                onClick={() => setActiveSubMenu(option)}
              >
                {option.text}
              </a>
            </Link>

            {activeSubMenu?.equals(option) && (
              <div className={s.subMenu}>
                {option.subMenu.map((subOption) => (
                  <Link href={subOption.href}>
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
            )}
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
      {auth.isSignedIn && (
        <Link href="/admin">
          <a className={s.adminLink}>Admin</a>
        </Link>
      )}
    </div>
  )
}
