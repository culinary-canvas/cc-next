import React from 'react'
import s from './Menu.module.scss'
import Link from 'next/link'
import { menuOptions } from './menuOptions'
import { useMenu } from './Menu.context'
import { classnames } from '../services/importHelpers'

interface Props {
  className?: string
}

export function Menu(props: Props) {
  const { className } = props
  const { activeMenuOption } = useMenu()

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
    </div>
  )
}
