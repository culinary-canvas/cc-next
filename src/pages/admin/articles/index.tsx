import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import ArticleApi from '../../../article/Article.api'
import { ArticleService } from '../../../article/Article.service'
import { ArticleList } from '../../../article/list/ArticleList'
import { ArticleModel } from '../../../article/models/Article.model'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { Button } from '../../../shared/button/Button'
import s from './articleList.module.scss'

interface Props {
  articleData: { [key: string]: any }[]
}

function ArticleListPage({ articleData }: Props) {
  const articles = useTransformToModels(articleData, ArticleModel)
  const allowed = useAuthGuard()
  const router = useRouter()

  useEffect(() => {
    ArticleService.populateIssues(articles)
  }, [articles])

  if (!allowed) {
    return null
  }
  return (
    <main className={s.container}>
      <Button onClick={() => router.push('/admin/issues')}>Edit issues</Button>
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
