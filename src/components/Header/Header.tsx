import React from 'react'
import styles from './Header.module.scss'
import { useEnv } from '../../services/AppEnvironment'
import Link from 'next/Link'
import { Menu } from '../Menu/Menu'
import Logo from '../../../public/assets/logo.svg'

export const Header = () => {
  const env = useEnv()
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/" passHref>
          <a onClick={() => env.articleStore.setTypeFilter(null)}>
            <img
              src={Logo}
              alt="Culinary Canvas"
              className={styles.logo}
              title="Go to start"
            />
          </a>
        </Link>

        <Menu />
      </div>
    </header>
  )
}
