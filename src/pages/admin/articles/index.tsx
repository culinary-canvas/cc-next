import React from 'react'
import { ArticleList } from '../../../admin/article/list/ArticleList'
import { GetServerSideProps } from 'next'
import { ArticleModel } from '../../../article/Article.model'
import s from './articleList.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import ArticleApi from '../../../article/Article.api'
import { AdminMenu } from '../../../admin/menu/AdminMenu'
import { useTransformToModels } from '../../../hooks/useTransformToModels'

interface Props {
  articleData: { [key: string]: any }[]
}

function ArticleListPage({ articleData }: Props) {
  const articles = useTransformToModels(articleData, ArticleModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }
  return (
    <main className={s.container}>
      <AdminMenu/>
      <ArticleList articles={articles} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const articleData = await ArticleApi.allNoTransform()

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
  }
}

export default ArticleListPage
