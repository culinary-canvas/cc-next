import React from 'react'
import { ArticleList } from '../../../admin/article/list/ArticleList'
import { GetServerSideProps } from 'next'
import { initFirebase } from '../../../services/firebase/Firebase.service'
import { ArticleApi } from '../../../article/Article.api'
import { ArticleModel } from '../../../article/Article.model'
import { useTransform } from '../../../hooks/useTransform'
import s from './articleList.module.scss'
import {useAuth} from '../../../services/auth/Auth'
import {useAuthGuard} from '../../../hooks/useAuthGuard'

interface Props {
  articleData: Partial<ArticleModel>[]
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
  initFirebase()
  const articleData = await ArticleApi.all()
  return {
    props: {
      articleData,
    },
  }
}

export default ArticleListPage
