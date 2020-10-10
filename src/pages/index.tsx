import React, { useEffect, useState } from 'react'
import { useEnv } from '../services/AppEnvironment'
import { ArticleGrid } from '../components/ArticleGrid/ArticleGrid'
import styles from './start.module.scss'
import { Article } from '../domain/Article/Article'
import { GetStaticProps } from 'next'
import { ArticleApi } from '../domain/Article/Article.api'
import { classnames } from '../services/importHelpers'
import { useTransform } from '../hooks/useTransform'
import { useAutorun } from '../hooks/useAutorun'

interface Props {
  articlesData: Partial<Article>[]
}

function Start({ articlesData }: Props) {
  const env = useEnv()
  const articles = useTransform(articlesData, Article)

  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  useEffect(() => console.log(process.env.NEXT_PUBLIC_ENVIRONMENT), [])

  useAutorun(() => {
    if (env.adminStore.showUnpublishedOnStartPage) {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter((a) => a.published))
    }
  })

  return (
    <main className={classnames(styles.container)}>
      <ArticleGrid articles={filteredArticles} />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [articlesData] = await Promise.all([ArticleApi.all()])

  return {
    props: {
      articlesData,
    },
    revalidate: 1,
  }
}

export default Start
