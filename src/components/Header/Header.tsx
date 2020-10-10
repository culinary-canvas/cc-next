import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import { Menu } from '../Menu/Menu'
import Logo from '../../../public/assets/logo.svg'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/" passHref>
          <a
            onClick={() => {
              router.push('/')
            }}
          >
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
