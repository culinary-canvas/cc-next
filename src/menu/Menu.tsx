import React from 'react'
import s from './Menu.module.scss'
import Link from 'next/link'
import { menuOptions } from './menuOptions'
import { useMenu } from './Menu.context'
import { classnames } from '../services/importHelpers'
import { useAuth } from '../services/auth/Auth'

interface Props {
  className?: string
}

export function Menu(props: Props) {
  const { className } = props
  const { activeMenuOption } = useMenu()
  const auth = useAuth()
  return (
    <div className={classnames(s.container, className)}>
      {Object.values(menuOptions).map((option) => (
        <Link key={option.href} href={option.href}>
          <a
            className={classnames({
              [s.active]: option.equals(activeMenuOption),
            })}
          >
            {option.text}
          </a>
        </Link>
      ))}
      {auth.isSignedIn && (
        <Link href="/admin">
          <a className={s.adminLink}>Admin</a>
        </Link>
      )}
    </div>
  )
}
