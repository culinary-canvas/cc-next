import React from 'react'
import { observer } from 'mobx-react'
import { ArticleModel } from '../../../article/Article.model'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransform } from '../../../hooks/useTransform'
import s from './articlePage.module.scss'
import { ContentType } from '../../../article/content/ContentType'
import { TextContentModel } from '../../../article/content/text/TextContent.model'
import { PageHead } from '../../../head/PageHead'
import { Article } from '../../../article/Article'
import { ArticleApi } from '../../../article/Article.api'

interface Props {
  articleData: any
}

const ArticlePage = observer(({ articleData }: Props) => {
  const article = useTransform([articleData], ArticleModel)[0]

  return (
    <>
      <PageHead
        image={article.imageContent.set.l.url}
        imageWidth={article.imageContent.set.l.width}
        imageHeight={article.imageContent.set.l.height}
        imageAlt={article.imageContent.alt}
        title={article.title}
        description={
          (article.titleSection.contents.find(
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
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, StaticProps> = async ({
  params,
}) => {
  const articleData = await ArticleApi.bySlug(params.slug)

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
    revalidate: 1,
  }
}

export default ArticlePage
