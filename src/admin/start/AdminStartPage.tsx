import React from 'react'
import s from './AdminStartPage.module.scss'
import Link from 'next/link'

export function AdminStartPage() {
  return (
    <div className={s.container}>
      <Link href="/admin/articles">Articles</Link>
      <Link href="/admin/persons">Persons</Link>
      <Link href="/admin/persons">Persons</Link>
    </div>
  )
}
