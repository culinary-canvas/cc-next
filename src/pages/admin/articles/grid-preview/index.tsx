import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { GetStaticProps } from 'next'
import React from 'react'
import { ArticleApi } from '../../../../article/Article.api'
import { ArticleGrid } from '../../../../article/grid/ArticleGrid'
import { Splash } from '../../../../article/grid/splash/Splash'
import { ArticleModel } from '../../../../article/models/Article.model'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useTransformToModels } from '../../../../hooks/useTransformToModels'
import { firebase } from '../../../../services/firebase/Firebase'
import { classnames } from '../../../../services/importHelpers'
import { PageHead } from '../../../../shared/head/PageHead'
import s from './gridPreview.module.scss'

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
          useBig
          insertComponent={() => <Splash />}
          insertComponentAtIndex={1}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { db } = firebase()

  const response = await getDocs(
    query(
      collection(db, 'articles'),
      orderBy('sortOrder', 'desc'),
      limit(PAGE_SIZE),
    ),
  )
  const articlesData = !!response.size
    ? response.docs.map((d) => ({ id: d.id, ...d.data() }))
    : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
    revalidate: 1,
  }
}

export default Start
