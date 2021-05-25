import React from 'react'
import { observer } from 'mobx-react-lite'
import { ArticleModel } from '../../../article/models/Article.model'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import s from './articlePage.module.scss'
import { ContentType } from '../../../article/models/ContentType'
import { TextContentModel } from '../../../article/models/TextContent.model'
import { PageHead } from '../../../shared/head/PageHead'
import { ArticleView } from '../../../article/view/ArticleView'
import { ArticleApi } from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'

interface Props {
  articleData: any
}

const ArticlePage = observer(({ articleData }: Props) => {
  const article = useTransformToModel(articleData, ArticleModel)

  return (
    <>
      <PageHead
        image={article.imageContent.url}
        imageWidth={article.imageContent.set.width}
        imageHeight={article.imageContent.set.height}
        imageAlt={article.imageContent.alt}
        title={article.title}
        description={
          (article.titleSection.contents.find(
            (c) => c.type === ContentType.SUB_HEADING,
          ) as TextContentModel)?.value
        }
      />
      <main className={s.container}>
        <ArticleView article={article} />
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
  const articleData = !!response.size
    ? { id: response.docs[0].id, ...response.docs[0].data() }
    : []

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
    revalidate: 1,
  }
}

export default ArticlePage
