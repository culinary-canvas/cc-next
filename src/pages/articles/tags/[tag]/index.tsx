import React, { useEffect } from 'react'
import s from './articlesByTag.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { ArticleModel } from '../../../../article/Article.model'
import { PageHead } from '../../../../head/PageHead'
import { classnames } from '../../../../services/importHelpers'
import { ArticleGrid } from '../../../../article/grid/ArticleGrid'
import ArticleApi from '../../../../article/Article.api'
import { initFirebase } from '../../../../services/firebase/Firebase'

interface Props {
  articlesData: any[]
  tag: string
}

const PAGE_SIZE = 6

function ArticlesPerType({ articlesData, tag }: Props) {
  const articles = useTransformToModel(articlesData, ArticleModel)

  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  return (
    <>
      <PageHead
        title={`Culinary Canvas — #${tag} (${articles.length} articles)`}
        image={articles[0].imageContent.url}
        imageWidth={articles[0].imageContent.set.cropped.width}
        imageHeight={articles[0].imageContent.set.cropped.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid
          initialArticles={articles}
          load={async (last) =>
            ArticleApi.publishedByTagPagedBySortOrderDesc(
              tag,
              PAGE_SIZE,
              last.sortOrder,
            )
          }
        />
      </main>
    </>
  )
}

interface StaticProps {
  tag: string
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  const { firestore } = initFirebase()
  const response = await firestore().collection('tags').get()
  const tags = response.docs.map((d) => d.data())

  return {
    paths: tags.map((tag) => ({
      params: {
        tag: tag.name,
      },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  Props & { [key: string]: any },
  StaticProps
> = async ({ params }) => {
  const { firestore } = initFirebase()

  const response = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .where('tagNames', 'array-contains', params.tag)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()
  const articlesData = !!response.size ? response.docs.map((d) => d.data()) : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      tag: params.tag,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
