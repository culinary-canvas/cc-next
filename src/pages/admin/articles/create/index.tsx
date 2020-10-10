import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import s from './articleEdit.module.scss'
import { useFormControl } from '../../../../hooks/useFormControl'
import { ArticleForm } from '../../../../components/ArticleForm/ArticleForm'
import { ArticleService } from '../../../../domain/Article/Article.service'
import { useAdmin } from '../../../../services/admin/Admin.store'
import { useAuth } from '../../../../services/auth/Auth'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'

export default function ArticleEdit({ articleData }) {
  const admin = useAdmin()
  const allowed = useAuthGuard()

  const formControl = useFormControl(ArticleService.create(), [
    { field: 'title', required: true },
  ])

  useEffect(() => {
    if (!!formControl) {
      admin.setSidebar(true)
      admin.setSidebarOpen(true)
      admin.setFormControl(formControl)
      admin.setSection(formControl.mutable.titleSection)
      admin.setContent(formControl.mutable.titleSection.sortedContents[0])
    }
  }, [formControl])

  if (!allowed) {
    return null
  }

  if (!formControl) {
    return null
  }

  return (
    <>
      <main className={s.container}>
        <ArticleForm />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
