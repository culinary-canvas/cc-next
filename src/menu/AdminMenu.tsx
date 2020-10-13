import React from 'react'
import { observer } from 'mobx-react'
import s from './AdminMenu.module.scss'
import { SignOut } from '../admin/signOut/SignOut'
import { classnames } from '../services/importHelpers'
import { useRouter } from 'next/router'

export const AdminMenu = observer(() => {
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
        onClick={() => router.push('/admin/articles/grid-preview')}
        title="Preview start page including unpublished articles"
      >
        Preview start page
      </button>
      <SignOut />
    </span>
  )
})
