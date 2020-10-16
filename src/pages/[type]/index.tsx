import React, { useEffect, useState } from 'react'
import { ArticleModel } from '../../article/Article.model'
import { useAdmin } from '../../admin/Admin'
import { PageHead } from '../../head/PageHead'
import { classnames } from '../../services/importHelpers'
import s from './articlesPerType.module.scss'
import { ArticleGrid } from '../../article/grid/ArticleGrid'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleApi } from '../../article/Article.api'
import { ArticleType } from '../../article/ArticleType'
import { Transformer } from '../../services/db/Transformer'
import { useRouter } from 'next/router'

interface Props {
  articlesData: Partial<ArticleModel>[]
  type: ArticleType
}

function ArticlesPerType({ articlesData, type }: Props) {
  const router = useRouter()

  if (router.isFallback) {
    return <main>Loading...</main>
  }

  const admin = useAdmin()
  const [articles, setArticles] = useState<ArticleModel[]>(
    Transformer.allToApp(articlesData, ArticleModel),
  )

  useEffect(() => {
    setArticles(Transformer.allToApp(articlesData, ArticleModel))
  }, [articlesData, type])

  const [filteredArticles, setFilteredArticles] = useState<ArticleModel[]>([])

  useEffect(() => {
    if (admin.showUnpublishedOnStartPage) {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter((a) => a.published))
    }
  }, [admin.showUnpublishedOnStartPage, articles])

  return (
    <>
      <PageHead
        image={articles[0].imageContent.set.l.url}
        imageWidth={articles[0].imageContent.set.l.width}
        imageHeight={articles[0].imageContent.set.l.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid articles={filteredArticles} />
      </main>
    </>
  )
}

interface StaticProps {
  type: ArticleType
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  return {
    paths: Object.values(ArticleType).map((type) => ({
      params: {
        type,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  Props & { [key: string]: any },
  StaticProps
> = async ({ params }) => {
  const articlesData = await ArticleApi.byType(params.type)
  return {
    props: {
      articlesData,
      type: params.type,
    },
    revalidate: 1,
  }
}

export default ArticlesPerType
