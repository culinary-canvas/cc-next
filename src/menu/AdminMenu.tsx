import React from 'react'
import { observer } from 'mobx-react'
import s from './AdminMenu.module.scss'
import { SignOut } from '../admin/signOut/SignOut'
import { classnames } from '../services/importHelpers'
import { useRouter } from 'next/router'
import { useAdmin } from '../admin/Admin'

export const AdminMenu = observer(() => {
  const admin = useAdmin()
  const router = useRouter()

  return (
    <span className={s.adminMenu}>
      <button
        className={classnames('a', s.a)}
        onClick={() => router.push('/admin/articles')}
      >
        Articles
      </button>
      <button
        className={classnames('a', s.a, s.showOnMobile)}
        onClick={() =>
          admin.setShowUnpublishedOnStartPage(!admin.showUnpublishedOnStartPage)
        }
        title="Toggle showing unpublished articles on start page"
      >
        {admin.showUnpublishedOnStartPage ? 'Hide unpubs' : 'Show unpubs'}
      </button>
      <SignOut />
    </span>
  )
})
