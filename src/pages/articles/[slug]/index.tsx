import React from 'react'
import { observer } from 'mobx-react'
import { ArticleModel } from '../../../article/Article.model'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleApi } from '../../../article/Article.api'
import { useTransform } from '../../../hooks/useTransform'
import { PlainObject } from '../../../services/types/PlainObject'
import s from './articlePage.module.scss'
import { ContentType } from '../../../article/content/ContentType'
import { TextContentModel } from '../../../article/content/text/TextContent.model'
import { PageHead } from '../../../head/PageHead'
import { Article } from '../../../article/Article'

interface Props {
  articleData: PlainObject<ArticleModel>
}

const ArticlePage = observer(({ articleData }: Props) => {
  const router = useRouter()

  if (router.isFallback) {
    return <main>Loading...</main>
  }

  const article = useTransform([articleData], ArticleModel)[0]

  return (
    <>
      <PageHead
        image={article.imageContent.url}
        imageAlt={article.imageContent.alt}
        title={article.title}
        description={
          (article.titleSection.sortedContents.find(
            (c) => c.type === ContentType.SUB_HEADING,
          ) as TextContentModel)?.value
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
