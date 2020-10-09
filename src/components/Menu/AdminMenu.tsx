import React from 'react'
import { observer } from 'mobx-react'
import s from './AdminMenu.module.scss'
import { SignOutButton } from '../SignOutButton/SignOutButton'
import { useEnv } from '../../services/AppEnvironment'
import { classnames } from '../../services/importHelpers'
import { useRouter } from 'next/router'

export const AdminMenu = observer(() => {
  const env = useEnv()
  const router = useRouter()

  return (
    <span className={s.adminMenu}>
      <button className={classnames('a', s.a)} onClick={() => router.push('/admin/articles')}>
        Articles
      </button>
      <button
        className={classnames('a', s.a, s.showOnMobile)}
        onClick={() => env.adminStore.toggleShowUnpublishedOnStartPage()}
        title="Toggle showing unpublished articles on start page"
      >
        {env.adminStore.showUnpublishedOnStartPage
          ? 'Hide unpubs'
          : 'Show unpubs'}
      </button>
      <SignOutButton />
    </span>
  )
})
