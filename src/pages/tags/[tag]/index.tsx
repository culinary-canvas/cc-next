import React, { useEffect } from 'react'
import s from './articlesByTag.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { ArticleModel } from '../../../article/Article.model'
import { PageHead } from '../../../head/PageHead'
import { classnames } from '../../../services/importHelpers'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../../_app'

interface Props {
  articlesData: any[]
  tag: string
}

const PAGE_SIZE = 6

function ArticlesByTag({ articlesData, tag }: Props) {
  const articles = useTransformToModel(articlesData, ArticleModel)
  const router = useRouter()
  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

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
          labels={[{ label: tag, path: `/tags/${tag}` }]}
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
  const response = await firestore().collection('articles').get()
  const tags = response.docs.flatMap((d) => d.data().tagNames)
  return {
    paths: tags.map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: true,
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

export default ArticlesByTag
