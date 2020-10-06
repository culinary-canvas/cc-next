import React from 'react'
import { observer } from 'mobx-react'
import { Article } from '../../components/Article/Article'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleApi } from '../../domain/Article/Article.api'
import { Article as _Article } from '../../domain/Article/Article'
import { useTransform } from '../../hooks/useTransform'

interface StaticProps {
  titleForUrl: string
  [key: string]: string
}

interface Props {
  articleData: Partial<_Article>
}

const ArticlePage = observer((props: Props) => {
  const router = useRouter()
  const article = useTransform([props.articleData], _Article)[0]

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!article) {
    return null
  }

  return (
    <main className="article container">
      <Article article={article} />
    </main>
  )
})

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  const articles = await ArticleApi.all()

  return {
    paths: articles.map((article) => ({
      params: {
        titleForUrl: article.titleForUrl,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  Props & { [key: string]: any },
  StaticProps
> = async ({ params }) => {
  const articleData = await ArticleApi.byTitleForUrl(params.titleForUrl)

  return {
    props: {
      articleData,
    },
    revalidate: 1,
  }
}

export default ArticlePage
