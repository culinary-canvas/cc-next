import React, { useEffect, useState } from 'react'
import s from './articlesPerType.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleType } from '../../article/ArticleType'
import { ArticleModel } from '../../article/Article.model'
import { Transformer } from '../../services/db/Transformer'
import { PageHead } from '../../head/PageHead'
import { classnames } from '../../services/importHelpers'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { ArticleApi } from '../../article/Article.api'
import StringUtils from '../../services/utils/StringUtils'
import { useRouter } from 'next/router'

interface Props {
  articlesData: Partial<ArticleModel>[]
  type: ArticleType
}

const PAGE_SIZE = 4

function ArticlesPerType({ articlesData, type }: Props) {
  const router = useRouter()

  if (router.isFallback) {
    return <main>Loading...</main>
  }

  const [articles, setArticles] = useState<ArticleModel[]>(
    Transformer.allToApp(articlesData, ArticleModel),
  )

  useEffect(() => {
    setArticles(Transformer.allToApp(articlesData, ArticleModel))
  }, [articlesData])

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
          load={async (lastLoaded) => {
            const data = await ArticleApi.publishedByTypePagedBySortOrderDesc(
              type,
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

interface StaticProps {
  type: ArticleType
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  console.log(Object.values(ArticleType))
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
  const type = Object.values(ArticleType).find(
    (t) => StringUtils.toLowerKebabCase(t) === params.type,
  )

  const articlesData = await ArticleApi.publishedByTypePagedBySortOrderDesc(
    type,
    PAGE_SIZE,
  )
  return {
    props: {
      articlesData,
      type,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
