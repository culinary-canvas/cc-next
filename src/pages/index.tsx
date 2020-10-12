import React, { useEffect, useState } from 'react'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import styles from './start.module.scss'
import { ArticleModel } from '../article/Article.model'
import { GetStaticProps } from 'next'
import { ArticleApi } from '../article/Article.api'
import { classnames } from '../services/importHelpers'
import { useTransform } from '../hooks/useTransform'
import { useAdmin } from '../admin/Admin'
import { PageHead } from '../head/PageHead'

interface Props {
  articlesData: Partial<ArticleModel>[]
}

function Start({ articlesData }: Props) {
  const admin = useAdmin()
  const articles = useTransform(articlesData, ArticleModel)

  const [filteredArticles, setFilteredArticles] = useState<ArticleModel[]>([])

  useEffect(() => {
    if (admin.showUnpublishedOnStartPage) {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter((a) => a.published))
    }
  }, [admin.showUnpublishedOnStartPage])

  return (
    <>
      <PageHead
        image={articles[0].imageContent.url}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(styles.container)}>
        <ArticleGrid articles={filteredArticles} />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articlesData = await ArticleApi.all()

  return {
    props: {
      articlesData,
    },
    revalidate: 1,
  }
}

export default Start
