import React, { useState } from 'react'
import s from './MobileMenu.module.scss'
import Link from 'next/link'
import { menuOptions } from './menuOptions'
import { useMenu } from './Menu.context'
import { classnames } from '../services/importHelpers'
import { MenuButton } from './button/MenuButton'

interface Props {
  className?: string
}

export function MobileMenu(props: Props) {
  const { className } = props
  const { activeMenuOption } = useMenu()

  const [visible, show] = useState<boolean>(false)

  return (
    <>
      <MenuButton
        open={visible}
        onClick={() => show(!visible)}
        className={s.button}
      />
      <div
        className={classnames(s.container, { [s.open]: visible }, className)}
      >
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
    </>
  )
}
