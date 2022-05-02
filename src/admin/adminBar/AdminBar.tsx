import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useAuth } from '../../services/auth/Auth'
import s from './AdminBar.module.scss'

export function AdminBar() {
  const { isSignedIn } = useAuth()
  const { asPath } = useRouter()

  const editLink = useMemo(() => {
    if (asPath.startsWith('/articles/')) {
      const parts = asPath.split('/')
      const slug = parts[parts.length - 1]
      return `/admin/articles/${slug}`
    }
  }, [asPath])

  if (!isSignedIn) {
    return null
  }

  return (
    <div className={s.bar}>
      <span>Admin</span>
      <Link href="/admin/articles">
        <a
          className={classNames(
            asPath.startsWith('/admin/articles') && s.active,
          )}
        >
          Articles
        </a>
      </Link>

      <Link href="/admin/issues">
        <a
          className={classNames(asPath.startsWith('/admin/issues') && s.active)}
        >
          Issues
        </a>
      </Link>

      <Link href="/admin/companies">
        <a
          className={classNames(
            asPath.startsWith('/admin/companies') && s.active,
          )}
        >
          Companies
        </a>
      </Link>

      <Link href="/admin/persons">
        <a
          className={classNames(
            asPath.startsWith('/admin/persons') && s.active,
          )}
        >
          Persons
        </a>
      </Link>

      <div className={s.right}>
        {!!editLink && (
          <Link href={editLink}>
            <a>Edit</a>
          </Link>
        )}
      </div>
    </div>
  )
}
