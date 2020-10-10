import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import s from './articleEdit.module.scss'
import { PlainObject } from '../../../../types/PlainObject'
import { Article } from '../../../../domain/Article/Article'
import { useTransform } from '../../../../hooks/useTransform'
import { useFormControl } from '../../../../hooks/useFormControl'
import { ArticleForm } from '../../../../components/ArticleForm/ArticleForm'
import { ArticleApi } from '../../../../domain/Article/Article.api'
import { useAdmin } from '../../../../services/admin/Admin.store'
import { useUnmount } from '../../../../hooks/useUnmount'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'

interface Props {
  articleData: PlainObject<Article>
}

export default function ArticleEdit({ articleData }) {
  const admin = useAdmin()
  const article = useTransform([articleData], Article)[0]
  const allowed = useAuthGuard()

  const formControl = useFormControl(article, [
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
      articleData,
    },
  }
}
