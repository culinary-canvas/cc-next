import React, { useEffect, useState } from 'react'
import { Article } from '../../domain/Article/Article'
import { useAdmin } from '../../services/admin/Admin.store'
import { PageHead } from '../../components/PageHead/PageHead'
import { classnames } from '../../services/importHelpers'
import s from './articlesPerType.module.scss'
import { ArticleGrid } from '../../components/ArticleGrid/ArticleGrid'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleApi } from '../../domain/Article/Article.api'
import { ArticleType } from '../../domain/Article/ArticleType'
import { Transformer } from '../../services/db/Transformer'
import { useRouter } from 'next/router'

interface Props {
  articlesData: Partial<Article>[]
  type: ArticleType
}

function ArticlesPerType({ articlesData, type }: Props) {
  const router = useRouter()

  if (router.isFallback) {
    return <main>Loading...</main>
  }

  const admin = useAdmin()
  const [articles, setArticles] = useState<Article[]>(
    Transformer.allToApp(articlesData, Article),
  )

  useEffect(() => {
    setArticles(Transformer.allToApp(articlesData, Article))
  }, [articlesData, type])

  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

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
        image={articles[0].imageContent.url}
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
