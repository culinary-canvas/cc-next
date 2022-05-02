import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import ArticleApi from '../../article/Article.api'
import { ArticleService } from '../../article/Article.service'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { ArticleModel } from '../../article/models/Article.model'
import { useTransformToModels } from '../../hooks/useTransformToModels'
import { isNil } from '../../services/importHelpers'
import { PageHead } from '../../shared/head/PageHead'
import { isServer } from '../_app'
import s from './articles.module.scss'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 9

function Articles({ articlesData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const router = useRouter()

  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  useEffect(() => {
    ArticleService.populateIssues(articles)
  }, [articles])

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

  return (
    <>
      <PageHead
        title={`Culinary Canvas — Articles (${
          !isNil(articles) ? articles.length : 0
        } articles)`}
      />

      <main className={classNames(s.container)}>
        <h1>Articles</h1>
        <ArticleGrid
          initialArticles={articles}
          load={async (lastLoaded) =>
            ArticleApi.publishedPagedBySortOrderDesc(
              PAGE_SIZE,
              lastLoaded.sortOrder,
            )
          }
        />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const articlesData = await ArticleApi.fetchRawArticles(PAGE_SIZE, false)

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
  }
}

export default Articles
