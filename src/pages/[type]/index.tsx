import React, { useEffect } from 'react'
import s from './articlesByType.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleType } from '../../article/models/ArticleType'
import { ArticleModel } from '../../article/models/Article.model'
import { PageHead } from '../../shared/head/PageHead'
import { classnames } from '../../services/importHelpers'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { ArticleApi } from '../../article/Article.api'
import { ArticleTypeService } from '../../article/services/ArticleType.service'
import StringUtils from '../../services/utils/StringUtils'
import { firebase } from '../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../_app'
import { useTransformToModels } from '../../hooks/useTransformToModels'
import { useMenu } from '../../menu/Menu.context'
import { menuOptions } from '../../menu/models/menuOptions'
import { AppService } from '../../services/App.service'
import { ArticleService } from '../../article/Article.service'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

interface Props {
  articlesData: any[]
  type: ArticleType
}

const PAGE_SIZE = 6

function ArticlesPerType({ articlesData, type }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const router = useRouter()
  const { setActiveMenuOption, activeMenuOption } = useMenu()

  useEffect(() => setActiveMenuOption(menuOptions[type]), [type])
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
        image={articles[0]?.imageContent?.url || AppService.DEFAULT_SHARE_IMAGE}
        imageWidth={articles[0]?.imageContent.set?.width}
        imageHeight={articles[0]?.imageContent.set?.height}
        imageAlt={
          articles[0]?.imageContent?.alt || AppService.DEFAULT_SHARE_IMAGE_ALT
        }
      />
      <main className={classnames(s.container)}>
        <h1>{activeMenuOption?.text}</h1>
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
    paths: Object.values(ArticleType).map((type) => ({
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
  const { db } = firebase()
  const type = ArticleTypeService.findByKebabCase(params.type)

  const response = await getDocs(
    query(
      collection(db, 'articles'),
      where('published', '==', true),
      where('type', '==', type),
      orderBy('sortOrder', 'desc'),
      limit(PAGE_SIZE),
    ),
  )
  const articlesData = !!response.size
    ? response.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => ArticleService.rawArticleIsPublished(a))
    : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      type,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
