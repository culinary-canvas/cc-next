import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import s from './articleEdit.module.scss'
import { ArticleModel } from '../../../../article/models/Article.model'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { useFormControl } from '../../../../services/formControl/useFormControl'
import { ArticleForm } from '../../../../article/form/ArticleForm'
import { useAdmin } from '../../../../admin/Admin.context'
import { useUnmount } from '../../../../hooks/useUnmount'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { ArticleApi } from '../../../../article/Article.api'

interface Props {
  articleData: any
}

export default function ArticleEdit({ articleData }) {
  const admin = useAdmin()
  const article = useTransformToModel(articleData, ArticleModel)
  const allowed = useAuthGuard()

  const [formControl] = useFormControl(article, [
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

  useUnmount(() => admin.reset())

  if (!allowed) {
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

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string }
> = async ({ params }) => {
  const articleData = await ArticleApi.bySlug(params.slug)

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
  }
}
