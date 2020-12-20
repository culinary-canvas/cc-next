import React from 'react'
import s from './gridPreview.module.scss'
import { GetStaticProps } from 'next'
import { ArticleModel } from '../../../../article/Article.model'
import { Transformer } from '../../../../services/db/Transformer'
import { PageHead } from '../../../../head/PageHead'
import { classnames } from '../../../../services/importHelpers'
import { ArticleGrid } from '../../../../article/grid/ArticleGrid'
import { ArticleApi } from '../../../../article/Article.api'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useTransform } from '../../../../hooks/useTransform'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 4

function Start({ articlesData }: Props) {
  const articles = useTransform(articlesData, ArticleModel)
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
            return !!data ? Transformer.dbToModels(data, ArticleModel) : null
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
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
    revalidate: 1,
  }
}

export default Start
