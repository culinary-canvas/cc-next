import React from 'react'
import { observer } from 'mobx-react'
import { ArticleModel } from '../../../article/Article.model'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import s from './articlePage.module.scss'
import { ContentType } from '../../../article/content/ContentType'
import { TextContentModel } from '../../../article/content/text/TextContent.model'
import { PageHead } from '../../../head/PageHead'
import { Article } from '../../../article/Article'
import { ArticleApi } from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'

interface Props {
  articleData: any
}

const ArticlePage = observer(({ articleData }: Props) => {
  const article = useTransformToModel(articleData, ArticleModel)

  console.log(
    articleData.sections[0].contents
      .filter((c) => !!c.value)
      .map((c) => c.value),
  )
  console.log(
    article.sections[0].contents.filter((c) => !!c.value).map((c) => c.value),
  )
  return (
    <>
      <PageHead
        image={article.imageContent.url}
        imageWidth={article.imageContent.set.cropped.width}
        imageHeight={article.imageContent.set.cropped.height}
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
  const { firestore } = initFirebase()

  const response = await firestore()
    .collection('articles')
    .where('slug', '==', params.slug)
    .get()
  const articleData = !!response.size ? response.docs[0].data() : []

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
    revalidate: 1,
  }
}

export default ArticlePage
