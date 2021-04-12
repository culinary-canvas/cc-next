import React, { useEffect } from 'react'
import s from './start.module.scss'
import { classnames } from '../services/importHelpers'
import { ArticleModel } from '../article/models/Article.model'
import { PageHead } from '../shared/head/PageHead'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import { ArticleApi } from '../article/Article.api'
import { GetStaticProps } from 'next'
import { initFirebase } from '../services/firebase/Firebase'
import { Splash } from '../article/grid/splash/Splash'
import { useTransformToModels } from '../hooks/useTransformToModels'
import { useMenu } from '../menu/Menu.context'
import { menuOptions } from '../menu/models/menuOptions'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 6

function Start({ articlesData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)

  const { setActiveMenuOption } = useMenu()
  useEffect(() => setActiveMenuOption(menuOptions.ALL), [])

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
          insertComponent={() => <Splash />}
          insertComponentAtIndex={1}
          initialArticles={articles}
          usePromoted
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
    .where('showOnStartPage', '==', true)
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
