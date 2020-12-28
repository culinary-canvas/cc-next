import React, { useEffect } from 'react'
import s from './articlesPerType.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleType } from '../../article/ArticleType'
import { ArticleModel } from '../../article/Article.model'
import { PageHead } from '../../head/PageHead'
import { classnames } from '../../services/importHelpers'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { ArticleApi } from '../../article/Article.api'
import { useTransformToModel } from '../../hooks/useTransformToModel'
import { ArticleTypeService } from '../../article/ArticleType.service'
import StringUtils from '../../services/utils/StringUtils'
import { initFirebase } from '../../services/firebase/Firebase'
import { Transformer } from '../../services/db/Transformer'

interface Props {
  articlesData: any[]
  type: ArticleType
}

const PAGE_SIZE = 4

function ArticlesPerType({ articlesData, type }: Props) {
  const articles = useTransformToModel(articlesData, ArticleModel)

  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

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
          load={async (last) => {
            console.log(
              type,
              PAGE_SIZE,
              last.sortOrder,
              await ArticleApi.publishedByTypePagedBySortOrderDesc(
                type,
                PAGE_SIZE,
                last.sortOrder,
              ),
            )
            return ArticleApi.publishedByTypePagedBySortOrderDesc(
              type,
              PAGE_SIZE,
              last.sortOrder,
            )
          }}
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
    fallback: 'blocking',
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
    .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
    .where('published', '==', true)
    .where('type', '==', type)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()
  const articlesData = !!response.size ? response.docs.map((d) => d.data()) : []

  console.log(articlesData.map((a) => a.title))
  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      type,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
