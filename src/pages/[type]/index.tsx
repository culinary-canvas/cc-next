import React, { useEffect } from 'react'
import s from './articlesByType.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleType } from '../../article/shared/ArticleType'
import { ArticleModel } from '../../article/Article.model'
import { PageHead } from '../../head/PageHead'
import { classnames } from '../../services/importHelpers'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { ArticleApi } from '../../article/Article.api'
import { useTransformToModel } from '../../hooks/useTransformToModel'
import { ArticleTypeService } from '../../article/shared/ArticleType.service'
import StringUtils from '../../services/utils/StringUtils'
import { initFirebase } from '../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../_app'
import { useTransformToModels } from '../../hooks/useTransformToModels'

interface Props {
  articlesData: any[]
  type: ArticleType
}

const PAGE_SIZE = 6

function ArticlesPerType({ articlesData, type }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
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
        image={articles[0].imageContent.url}
        imageWidth={articles[0].imageContent.set.cropped.width}
        imageHeight={articles[0].imageContent.set.cropped.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid
          initialArticles={articles}
          load={async (last) =>
            ArticleApi.publishedByTypePagedBySortOrderDesc(
              type,
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
  type: string
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  return {
    paths: Object.values(ArticleType)
      .filter((t) => t !== ArticleType.HOW_TO)
      .map((type) => ({
        params: {
          type: StringUtils.toLowerKebabCase(type),
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
  const type = ArticleTypeService.findByKebabCase(params.type)

  const response = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .where('type', '==', type)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()
  const articlesData = !!response.size ? response.docs.map((d) => d.data()) : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      type,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
