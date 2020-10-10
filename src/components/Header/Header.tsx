import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import { Menu } from '../Menu/Menu'
import Logo from '../../../public/assets/logo.svg'
import { useRouter } from 'next/router'
import { ArticleType } from '../../domain/Article/ArticleType'

export const Header = () => {
  const router = useRouter()
  console.log(router)
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <div className="leftContainer">
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
          {!!router.query.type && (
            <div className={styles.navMeta}>{getSiteHeader()}</div>
          )}
        </div>
        <Menu />
      </div>
    </header>
  )

  function getSiteHeader() {
    if (!router.query) {
      return false
    }
    switch (router.query.type as ArticleType) {
      case ArticleType.DISH:
        return 'Dishes'
      case ArticleType.PORTRAIT:
        return 'Portraits'
      case ArticleType.HOW_TO:
        return 'Recipes'
    }
  }
}
