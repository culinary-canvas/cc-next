import React from 'react'
import { ArticleList } from '../../../admin/article/list/ArticleList'
import { GetServerSideProps } from 'next'
import { ArticleModel } from '../../../article/Article.model'
import { useTransform } from '../../../hooks/useTransform'
import s from './articleList.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { ArticleApi } from '../../../article/Article.api'

interface Props {
  articleData: any[]
}

function ArticleListPage({ articleData }: Props) {
  const articles = useTransform(articleData, ArticleModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }
  return (
    <main className={s.container}>
      <ArticleList articles={articles} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const articleData = await ArticleApi.all()
  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
  }
}

export default ArticleListPage
