import React, { useEffect, useState } from 'react'
import { useEnv } from '../services/AppEnvironment'
import { ArticleGrid } from '../components/ArticleGrid/ArticleGrid'
import styles from './start.module.scss'
import { Article } from '../domain/Article/Article'
import { GetStaticProps } from 'next'
import { initFirebase } from '../services/firebase/Firebase.service'
import { ArticleApi } from '../domain/Article/Article.api'
import { classnames } from '../services/importHelpers'
import { useTransform } from '../hooks/useTransform'
import { TagApi } from '../domain/Tag/Tag.api'
import { Tag } from '../domain/Tag/Tag'

interface Props {
  articlesData: Partial<Article>[]
  tagsData: Partial<Tag>[]
}

function Start({ articlesData, tagsData }: Props) {
  const env = useEnv()
  const articles = useTransform(articlesData, Article)
  const tags = useTransform(tagsData, Tag)

  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  useEffect(() => {
    if (!!tags) {
      env.tagStore.set(tags)
    }
  })

  useEffect(() => {
    if (env.adminStore.showUnpublishedOnStartPage) {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter((a) => a.published))
    }
  }, [])

  return (
    <main className={classnames(styles.container)}>
      <ArticleGrid articles={filteredArticles} />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [articlesData, tagsData] = await Promise.all([
    ArticleApi.all(),
    TagApi.all(),
  ])

  return {
    props: {
      articlesData,
      tagsData,
    },
    revalidate: 1,
  }
}

export default Start
