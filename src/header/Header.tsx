import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import { Menu } from '../menu/Menu'
import Logo from '../../public/assets/logo.svg'
import { useRouter } from 'next/router'
import { ArticleType } from '../article/ArticleType'
import StringUtils from '../services/utils/StringUtils'

export const Header = () => {
  const router = useRouter()

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
      case StringUtils.toLowerKebabCase(ArticleType.DISH):
        return 'Dishes'
      case StringUtils.toLowerKebabCase(ArticleType.PORTRAIT):
        return 'Portraits'
      case StringUtils.toLowerKebabCase(ArticleType.HOW_TO):
        return 'Recipes'
    }
  }
}
