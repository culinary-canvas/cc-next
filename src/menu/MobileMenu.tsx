import React, { useState } from 'react'
import s from './MobileMenu.module.scss'
import Link from 'next/link'
import { menuOptions } from './menuOptions'
import { useMenu } from './Menu.context'
import { classnames } from '../services/importHelpers'
import { MenuButton } from './button/MenuButton'

interface Props {
  className?: string
  buttonClassName?: string
}

export function MobileMenu(props: Props) {
  const { className, buttonClassName } = props
  const { activeMenuOption } = useMenu()

  const [open, setOpen] = useState<boolean>(false)
  const [first, setFirst] = useState<boolean>(true)

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
