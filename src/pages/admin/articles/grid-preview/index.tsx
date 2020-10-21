import React, { useRef } from 'react'
import s from './gridPreview.module.scss'
import { GetStaticProps } from 'next'
import { ArticleModel } from '../../../../article/Article.model'
import { Transformer } from '../../../../services/db/Transformer'
import { PageHead } from '../../../../head/PageHead'
import { classnames } from '../../../../services/importHelpers'
import { ArticleGrid } from '../../../../article/grid/ArticleGrid'
import { ArticleApi } from '../../../../article/Article.api'
import {useAuthGuard} from '../../../../hooks/useAuthGuard'

interface Props {
  articlesData: Partial<ArticleModel>[]
}

const PAGE_SIZE = 4

function Start({ articlesData }: Props) {
  const articles = useRef<ArticleModel[]>(
    Transformer.allToApp(articlesData, ArticleModel),
  ).current

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
          load={async (lastLoaded) => {
            const data = await ArticleApi.allPagedBySortOrderDesc(
              PAGE_SIZE,
              lastLoaded.sortOrder,
            )
            return !!data ? Transformer.allToApp(data, ArticleModel) : null
          }}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articlesData = await ArticleApi.allPagedBySortOrderDesc(PAGE_SIZE)

  return {
    props: {
      articlesData,
    },
    revalidate: 1,
  }
}

export default Start
