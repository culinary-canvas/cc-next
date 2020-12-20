import React from 'react'
import s from './articlesPerType.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleType } from '../../article/ArticleType'
import { ArticleModel } from '../../article/Article.model'
import { Transformer } from '../../services/db/Transformer'
import { PageHead } from '../../head/PageHead'
import { classnames } from '../../services/importHelpers'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { ArticleApi } from '../../article/Article.api'
import { useTransform } from '../../hooks/useTransform'
import { ArticleTypeService } from '../../article/ArticleType.service'
import StringUtils from '../../services/utils/StringUtils'

interface Props {
  articlesData: any[]
  type: ArticleType
}

const PAGE_SIZE = 4

function ArticlesPerType({ articlesData, type }: Props) {
  const articles = useTransform(articlesData, ArticleModel)

  return (
    <>
      <PageHead
        image={articles[0].imageContent.set.l.url}
        imageWidth={articles[0].imageContent.set.l.width}
        imageHeight={articles[0].imageContent.set.l.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid
          initialArticles={articles}
          load={async (last) => {
            const data = await ArticleApi.publishedByTypePagedBySortOrderDesc(
              type,
              PAGE_SIZE,
              last.sortOrder,
            )
            return !!data ? Transformer.dbToModels(data, ArticleModel) : null
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
  const type = ArticleTypeService.findByKebabCase(params.type)
  const articlesData = await ArticleApi.publishedByTypePagedBySortOrderDesc(
    type,
    PAGE_SIZE,
  )

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      type,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
