import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import s from './articleEdit.module.scss'
import { PlainObject } from '../../../../types/PlainObject'
import { Article } from '../../../../domain/Article/Article'
import { useEnv } from '../../../../services/AppEnvironment'
import { useTransform } from '../../../../hooks/useTransform'
import { useFormControl } from '../../../../hooks/useFormControl'
import { ArticleForm } from '../../../../components/ArticleForm/ArticleForm'
import { ArticleApi } from '../../../../domain/Article/Article.api'

interface Props {
  articleData: PlainObject<Article>
}

export default function ArticleEdit({ articleData }) {
  const env = useEnv()
  const article = useTransform([articleData], Article)[0]

  const formControl = useFormControl(article, [
    { field: 'title', required: true },
  ])

  useEffect(() => {
    if (!!formControl) {
      env.adminStore.renderSidebar()
      env.adminStore.openSidebar()
      env.adminStore.setFormControl(formControl)
      env.adminStore.setSection(formControl.mutable.titleSection)
      env.adminStore.setContent(
        formControl.mutable.titleSection.sortedContents[0],
      )
    }
  }, [formControl])

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
