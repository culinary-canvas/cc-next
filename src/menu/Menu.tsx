import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styles from './Menu.module.scss'
import { AdminMenu } from './AdminMenu'
import { MenuButton } from './MenuButton/MenuButton'
import { useRouter } from 'next/router'
import { classnames } from '../services/importHelpers'
import { useAuth } from '../services/auth/Auth'
import { ArticleType } from '../article/ArticleType'
import StringUtils from '../services/utils/StringUtils'

export const Menu = observer(() => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const auth = useAuth()

  return (
    <nav className={classnames(styles.menu, { [styles.isOpen]: isOpen })}>
      <div className={styles.optionsContainer}>
        <div className={styles.options}>
          <button
            className={classnames(styles.a, 'a', {
              [styles.active]: router.pathname === '/',
            })}
            onClick={() => router.push('/')}
            disabled={router.pathname === '/'}
          >
            All
          </button>

          <button
            className={classnames(styles.a, 'a', {
              [styles.active]: router.query.type === ArticleType.DISH,
            })}
            onClick={() => {
              router.push(`/${StringUtils.toLowerKebabCase(ArticleType.DISH)}`)
              setOpen(false)
            }}
            disabled={
              router.query.type ===
              StringUtils.toLowerKebabCase(ArticleType.DISH)
            }
          >
            Dishes
          </button>
          <button
            className={classnames(styles.a, 'a', {
              [styles.active]: router.query.type === ArticleType.HOW_TO,
            })}
            onClick={() => {
              router.push(
                `/${StringUtils.toLowerKebabCase(ArticleType.HOW_TO)}`,
              )
              setOpen(false)
            }}
            disabled={
              router.query.type ===
              StringUtils.toLowerKebabCase(ArticleType.HOW_TO)
            }
          >
            Recipes
          </button>
          <button
            className={classnames(styles.a, 'a', {
              [styles.active]: router.query.type === ArticleType.PORTRAIT,
            })}
            onClick={() => {
              router.push(
                `/${StringUtils.toLowerKebabCase(ArticleType.PORTRAIT)}`,
              )
              setOpen(false)
            }}
            disabled={
              router.query.type ===
              StringUtils.toLowerKebabCase(ArticleType.PORTRAIT)
            }
          >
            Portraits
          </button>

          {auth.isSignedIn && <AdminMenu />}
        </div>
      </div>

      <MenuButton onClick={() => setOpen(!isOpen)} isOpen={isOpen} />
    </nav>
  )
})
