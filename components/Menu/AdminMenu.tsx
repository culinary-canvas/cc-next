import React from 'react'
import { observer } from 'mobx-react'
import './AdminMenu.module.scss'
import { SignOutButton } from '../SignOutButton/SignOutButton'
import { useEnv } from '../../services/AppEnvironment'
import Link from 'next/Link'

export const AdminMenu = observer(() => {
  const env = useEnv()

  return (
    <span className="admin-menu">
      <Link href="/admin/articles">
        <a className="a">Articles</a>
      </Link>
      <button
        className="a show-on-mobile"
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
