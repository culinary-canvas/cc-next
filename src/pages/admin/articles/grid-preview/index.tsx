import React from 'react'
import s from './gridPreview.module.scss'
import { GetStaticProps } from 'next'
import { ArticleModel } from '../../../../article/models/Article.model'
import { PageHead } from '../../../../shared/head/PageHead'
import { classnames } from '../../../../services/importHelpers'
import { ArticleGrid } from '../../../../article/grid/ArticleGrid'
import { ArticleApi } from '../../../../article/Article.api'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { initFirebase } from '../../../../services/firebase/Firebase'
import { useTransformToModels } from '../../../../hooks/useTransformToModels'
import { Splash } from '../../../../article/grid/splash/Splash'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 4

function Start({ articlesData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }

  return (
    <>
      <PageHead noIndex noFollow />
      <main className={classnames(s.container)}>
        <ArticleGrid
          initialArticles={articles}
          load={async (lastLoaded) =>
            ArticleApi.allPagedBySortOrderDesc(PAGE_SIZE, lastLoaded.sortOrder)
          }
          usePromoted
          insertComponent={() => <Splash />}
          insertComponentAtIndex={1}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { firestore } = initFirebase()

  const response = await firestore()
    .collection('articles')
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
