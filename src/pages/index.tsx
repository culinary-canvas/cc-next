import React from 'react'
import s from './start.module.scss'
import { classnames } from '../services/importHelpers'
import { ArticleModel } from '../article/Article.model'
import { PageHead } from '../head/PageHead'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import { ArticleApi } from '../article/Article.api'
import { GetStaticProps } from 'next'
import { useTransform } from '../hooks/useTransform'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 4

function Start({ articlesData }: Props) {
  const articles = useTransform(articlesData, ArticleModel)

  return (
    <>
      <PageHead
        image={articles[0].imageContent.set.l.url}
        imageWidth={articles[0].imageContent.set.l.width}
        imageHeight={articles[0].imageContent.set.l.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
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

export const getStaticProps: GetStaticProps = async () => {
  const articlesData = await ArticleApi.publishedPagedBySortOrderDesc(PAGE_SIZE)

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
    revalidate: 1,
  }
}

export default Start
