import { collection, getDocs, query, where } from 'firebase/firestore'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { ArticleApi } from '../../../article/Article.api'
import { ArticleService } from '../../../article/Article.service'
import { ArticleModel } from '../../../article/models/Article.model'
import { ContentType } from '../../../article/models/ContentType'
import { SectionModel } from '../../../article/models/Section.model'
import { TextContentModel } from '../../../article/models/TextContent.model'
import { ArticleView } from '../../../article/view/ArticleView'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { useAuth } from '../../../services/auth/Auth'
import { firebase } from '../../../services/firebase/Firebase'
import { PageHead } from '../../../shared/head/PageHead'
import s from './articlePage.module.scss'

interface Props {
  articleData: any
}

const ArticlePage = observer(({ articleData }: Props) => {
  const article = useTransformToModel(articleData, ArticleModel)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    ArticleService.populateIssues([article])
  }, [article])

  useEffect(() => {
    if (!!article) {
      runInAction(() =>
        article.sections.sort(
          (s1, s2) => getSectionSortValue(s1) - getSectionSortValue(s2),
        ),
      )
    }
  }, [article])

  return (
    <>
      <PageHead
        image={article.imageContent.url}
        imageWidth={article.imageContent.set.width}
        imageHeight={article.imageContent.set.height}
        imageAlt={article.imageContent.alt}
        title={article.title}
        description={
          (
            article.titleSection.contents.find(
              (c) => c.type === ContentType.SUB_HEADING,
            ) as TextContentModel
          )?.value
        }
      />
      <main className={isSignedIn ? s.containerAsAdmin : s.container}>
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

function getSectionSortValue(s: SectionModel) {
  return (
    s.format.gridPosition.startRow + s.format.gridPosition.startColumn / 1000
  )
}

export const getStaticProps: GetStaticProps<Props, StaticProps> = async ({
  params,
}) => {
  const { db } = firebase()

  const response = await getDocs(
    query(collection(db, 'articles'), where('slug', '==', params.slug)),
  )
  const articleData = !!response.size
    ? { id: response.docs[0].id, ...response.docs[0].data() }
    : null

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
    revalidate: 1,
  }
}

export default ArticlePage
