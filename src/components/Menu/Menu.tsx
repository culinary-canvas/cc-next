import React, { useState } from 'react'
import { observer } from 'mobx-react'
import './Menu.module.scss'
import { AdminMenu } from './AdminMenu'
import { MenuButton } from '../MenuButton/MenuButton'
import { useEnv } from '../../services/AppEnvironment'
import { useRouter } from 'next/router'
import { classnames } from '../../services/importHelpers'
import { ArticleType } from '../../domain/Article/ArticleType'
import { useAuth } from '../../services/auth/Auth'

export const Menu = observer(() => {
  const env = useEnv()
  const [isOpen, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const auth = useAuth()

  return (
    <nav className={classnames('menu', { 'is-open': isOpen })}>
      <div className="buttons container">
        <div className="buttons">
          <button
            className={classnames('a', {
              active: env.articleStore.filter === ArticleType.DISH,
            })}
            onClick={() => {
              env.articleStore.setFilter(ArticleType.DISH)
              // TODO nav
              //              router.navigate({ url: '/', method: 'anchor' })
            }}
          >
            Dishes
          </button>
          <button
            className={classnames('a', {
              active: env.articleStore.filter === ArticleType.HOW_TO,
            })}
            onClick={() => {
              env.articleStore.setFilter(ArticleType.HOW_TO)
              // TODO nav
              //            router.navigate({ url: '/', method: 'anchor' })
            }}
          >
            Recipes
          </button>
          <button
            className={classnames('a', {
              active: env.articleStore.filter === ArticleType.PORTRAIT,
            })}
            onClick={() => {
              env.articleStore.setFilter(ArticleType.PORTRAIT)
              // TODO nav
              //            router.navigate({ url: '/', method: 'anchor' })
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
