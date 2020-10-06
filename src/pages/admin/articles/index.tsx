import React from 'react'
import { ArticleList } from '../../../components/ArticleList/ArticleList'
import { GetServerSideProps } from 'next'
import { initFirebase } from '../../../services/firebase/Firebase.service'
import { ArticleApi } from '../../../domain/Article/Article.api'
import { Article } from '../../../domain/Article/Article'
import { useTransform } from '../../../hooks/useTransform'

interface Props {
  articleData: Partial<Article>[]
}

function ArticleListPage({ articleData }: Props) {
  const articles = useTransform(articleData, Article)

  return (
    <main className="container page">
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
