import React, { useRef } from 'react'
import s from './start.module.scss'
import { GetStaticProps } from 'next'
import { classnames } from '../services/importHelpers'
import { ArticleModel } from '../article/Article.model'
import { PageHead } from '../head/PageHead'
import { ArticleApi } from '../article/Article.api'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import { Transformer } from '../services/db/Transformer'

interface Props {
  articlesData: Partial<ArticleModel>[]
}

const PAGE_SIZE = 4

function Start({ articlesData }: Props) {
  const articles = useRef<ArticleModel[]>(
    Transformer.allToApp(articlesData, ArticleModel),
  ).current

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
          load={async (lastLoaded) => {
            console.log('loading!', lastLoaded.sortOrder, lastLoaded.title)
            const data = await ArticleApi.publishedPagedBySortOrderDesc(
              PAGE_SIZE,
              lastLoaded.sortOrder,
            )
            console.log(data)
            return !!data ? Transformer.allToApp(data, ArticleModel) : null
          }}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articlesData = await ArticleApi.publishedPagedBySortOrderDesc(PAGE_SIZE)

  return {
    props: {
      articlesData,
    },
    revalidate: 1,
  }
}

export default Start
