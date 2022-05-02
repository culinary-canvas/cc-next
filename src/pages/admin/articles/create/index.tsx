import { GetServerSideProps } from 'next'
import React, { useEffect } from 'react'
import { useAdmin } from '../../../../admin/Admin.context'
import { ArticleService } from '../../../../article/Article.service'
import { ArticleForm } from '../../../../article/form/ArticleForm'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useFormControl } from '../../../../services/formControl/useFormControl'
import s from './articleEdit.module.scss'

export default function ArticleEdit() {
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
