import React, { useEffect, useState } from 'react'
import { ArticleGrid } from '../components/ArticleGrid/ArticleGrid'
import styles from './start.module.scss'
import { Article } from '../domain/Article/Article'
import { GetStaticProps } from 'next'
import { ArticleApi } from '../domain/Article/Article.api'
import { classnames } from '../services/importHelpers'
import { useTransform } from '../hooks/useTransform'
import { useAutorun } from '../hooks/useAutorun'
import { useAdmin } from '../services/admin/Admin.store'
import AdminSidebar from '../components/AdminSidebar/AdminSidebar'

interface Props {
  articlesData: Partial<Article>[]
}

function Start({ articlesData }: Props) {
  const admin = useAdmin()
  const articles = useTransform(articlesData, Article)

  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  useAutorun(() => {
    if (admin.showUnpublishedOnStartPage) {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter((a) => a.published))
    }
  })

  return (
    <>
      {admin.sidebar && <AdminSidebar />}
      <main className={classnames(styles.container)}>
        <ArticleGrid articles={filteredArticles} />
      </main>
    </>
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
