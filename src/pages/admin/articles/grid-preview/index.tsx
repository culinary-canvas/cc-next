import React from 'react'
import s from './gridPreview.module.scss'
import { GetStaticProps } from 'next'
import { ArticleModel } from '../../../../article/Article.model'
import { PageHead } from '../../../../head/PageHead'
import { classnames } from '../../../../services/importHelpers'
import { ArticleGrid } from '../../../../article/grid/ArticleGrid'
import { ArticleApi } from '../../../../article/Article.api'
import { useTransform } from '../../../../hooks/useTransform'

interface Props {
  articlesData: Partial<ArticleModel>[]
}

function Start({ articlesData }: Props) {
  const articles = useTransform(articlesData, ArticleModel)

  return (
    <>
      <PageHead
        image={articles[0].imageContent.url}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid articles={articles} />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const articlesData = await ArticleApi.all()

  return {
    props: {
      articlesData,
    },
    revalidate: 1,
  }
}

export default Start
