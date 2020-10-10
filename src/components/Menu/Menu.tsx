import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styles from './Menu.module.scss'
import { AdminMenu } from './AdminMenu'
import { MenuButton } from '../MenuButton/MenuButton'
import { useRouter } from 'next/router'
import { classnames } from '../../services/importHelpers'
import { useAuth } from '../../services/auth/Auth'

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
              // TODO active: !env.articleStore.typeFilter, // TODO nav: && response.name === 'start',
            })}
            onClick={() => {
              //TODO nav: router.navigate({ url: '/', method: 'anchor' })
              // env.articleStore.setTypeFilter(null)
            }}
          >
            All
          </button>

          <button
            className={classnames(styles.a, 'a', {
              // active: env.articleStore.typeFilter === ArticleType.DISH,
              // TODO nav: && response.name === 'start',
            })}
            onClick={() => {
              // env.articleStore.setTypeFilter(ArticleType.DISH)
              // TODO nav: router.navigate({ url: '/', method: 'anchor' })
            }}
          >
            Dishes
          </button>
          <button
            className={classnames(styles.a, 'a', {
              // active: env.articleStore.typeFilter === ArticleType.HOW_TO,
              // TODO nav: &&                response.name === 'start',
            })}
            onClick={() => {
              // env.articleStore.setTypeFilter(ArticleType.HOW_TO)
              // TODO nav: router.navigate({ url: '/', method: 'anchor' })
            }}
          >
            Recipes
          </button>
          <button
            className={classnames(styles.a, 'a', {
              // active: env.articleStore.typeFilter === ArticleType.PORTRAIT,
              // TODO nav: &&                router.current().response.name === 'start',
            })}
            onClick={() => {
              // env.articleStore.setTypeFilter(ArticleType.PORTRAIT)
              // TODO nav: router.navigate({ url: '/', method: 'anchor' })
            }}
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
