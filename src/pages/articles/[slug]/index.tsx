import React from 'react'
import { observer } from 'mobx-react'
import { Article } from '../../../components/Article/Article'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleApi } from '../../../domain/Article/Article.api'
import { Article as _Article } from '../../../domain/Article/Article'
import { useTransform } from '../../../hooks/useTransform'
import { PlainObject } from '../../../types/PlainObject'
import s from './articlePage.module.scss'
import { ContentType } from '../../../domain/Text/ContentType'
import { TextContent } from '../../../domain/Text/TextContent'
import { PageHead } from '../../../components/PageHead/PageHead'

interface Props {
  articleData: PlainObject<_Article>
}

const ArticlePage = observer(({ articleData }: Props) => {
  const router = useRouter()

  if (router.isFallback) {
    return <main>Loading...</main>
  }

  const article = useTransform([articleData], _Article)[0]
  console.log('process.browser', process.browser)

  return (
    <>
      <PageHead
        image={article.imageContent.url}
        imageAlt={article.imageContent.alt}
        title={article.title}
        description={
          (article.titleSection.sortedContents.find(
            (c) => c.type === ContentType.SUB_HEADING,
          ) as TextContent)?.value
        }
      />
      <main className={s.container}>
        <Article article={article} />
      </main>
    </>
  )
})

interface StaticProps {
  slug: string
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  const articles = await ArticleApi.all()

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  Props & { [key: string]: any },
  StaticProps
> = async ({ params }) => {
  const articleData = await ArticleApi.bySlug(params.slug)
  return {
    props: {
      articleData,
    },
    revalidate: 1,
  }
}

export default ArticlePage
