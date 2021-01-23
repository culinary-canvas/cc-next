import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import s from './articleEdit.module.scss'
import { useFormControl } from '../../../../form/formControl/useFormControl'
import { ArticleForm } from '../../../../admin/article/form/ArticleForm'
import { ArticleService } from '../../../../article/Article.service'
import { useAdmin } from '../../../../admin/Admin'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'

export default function ArticleEdit({ articleData }) {
  const admin = useAdmin()
  const allowed = useAuthGuard()

  const [formControl] = useFormControl(ArticleService.create(), [
    { field: 'title', required: true },
  ])

  useEffect(() => {
    if (!!formControl) {
      admin.setSidebar(true)
      admin.setSidebarOpen(true)
      admin.setFormControl(formControl)
      admin.setSection(formControl.mutable.titleSection)
      admin.setContent(formControl.mutable.titleSection.contents[0])
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
