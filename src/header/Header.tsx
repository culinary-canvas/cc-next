import React, { useState } from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import Logo from '../../public/assets/logo.svg'
import { useRouter } from 'next/router'
import { ArticleType } from '../article/shared/ArticleType'
import StringUtils from '../services/utils/StringUtils'
import { animated, config, useSpring } from 'react-spring'
import dynamic from 'next/dynamic'

export const Header = () => {
  const router = useRouter()
  const [logoHovered, setLogoHovered] = useState<boolean>(false)

  const { boxShadow } = useSpring({
    boxShadow: logoHovered
      ? '0 0 10px 2px rgba(0,0,0,0.2)'
      : '0 0 20px 2px rgba(0,0,0,0.1)',
    config: config.molasses,
  })

  const Menu = dynamic(() => import('../menu/Menu'))

  return (
    <header className={styles.container}>
      <div className={styles.leftContainer}>
        <Link href="/" passHref>
          <a
            onClick={() => {
              router.push('/')
            }}
          >
            <animated.img
              onMouseOver={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              src={Logo}
              alt="Culinary Canvas"
              className={styles.logo}
              title="Go to start"
              style={{
                boxShadow,
              }}
            />
          </a>
        </Link>
        {!!router.query.type && (
          <div className={styles.navMeta}>{getArticleTypeHeader()}</div>
        )}
        {!!router.query.tag && (
          <div className={styles.navMeta}>#{router.query.tag}</div>
        )}
      </div>
      <Menu />
    </header>
  )

  function getArticleTypeHeader() {
    switch (router.query.type as ArticleType) {
      case StringUtils.toLowerKebabCase(ArticleType.DISH):
        return 'Dishes'
      case StringUtils.toLowerKebabCase(ArticleType.PORTRAIT):
        return 'Portraits'
      case StringUtils.toLowerKebabCase(ArticleType.RECIPE):
        return 'Recipes'
    }
  }
}
