import React from 'react'
import s from './start.module.scss'
import { classnames } from '../services/importHelpers'
import { ArticleModel } from '../article/Article.model'
import { PageHead } from '../head/PageHead'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import { ArticleApi } from '../article/Article.api'
import { GetStaticProps } from 'next'
import { useTransformToModel } from '../hooks/useTransformToModel'
import { initFirebase } from '../services/firebase/Firebase'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 6

function Start({ articlesData }: Props) {
  const articles = useTransformToModel(articlesData, ArticleModel)

  return (
    <>
      <PageHead
        image={articles[0].imageContent.url}
        imageWidth={articles[0].imageContent.set.cropped.width}
        imageHeight={articles[0].imageContent.set.cropped.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid
          showSplash
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
  const { firestore } = initFirebase()

  const response = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()
  const articlesData = !!response.size ? response.docs.map((d) => d.data()) : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
    revalidate: 1,
  }
}

export default Start
