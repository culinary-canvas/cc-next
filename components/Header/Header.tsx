import React from 'react'
import { Menu } from '../Menu/Menu'
import './Header.module.scss'
import logo from '../../assets/logo.svg'
import { Button } from '../Button/Button'
import { useEnv } from '../../services/AppEnvironment'
import Link from 'next/Link'

export const Header = () => {
  const env = useEnv()
  return (
    <header className="container header">
      <div className="content">
        <Link href="/">
          <Button
            unsetStyle
            onClick={() => {
              env.articleStore.setFilter(null)
            }}
          >
            <img src={logo} alt="Logotype" className="logo" />
          </Button>
        </Link>

        <Menu />
      </div>
    </header>
  )
}
