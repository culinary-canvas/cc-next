import React, { useEffect, useState } from 'react'
import s from './articlesByTag.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticleModel } from '../../../article/models/Article.model'
import { PageHead } from '../../../shared/head/PageHead'
import { classnames } from '../../../services/importHelpers'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../../_app'
import { ArticleWithLabels } from '../../../article/models/ArticleWithLabels'
import { ArticleLabel } from '../../../article/models/ArticleLabel'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { ArticleService } from '../../../article/Article.service'

interface Props {
  articlesData: any[]
  tag: string
}

const PAGE_SIZE = 6

function ArticlesByTag({ articlesData, tag }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const router = useRouter()
  const [articlesWithLabels, setArticlesWithLabels] = useState<
    ArticleWithLabels[]
  >([])
  const [label, setLabel] = useState<ArticleLabel>()

  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

  useEffect(() => setLabel(new ArticleLabel(tag, `/tags/${tag}`)), [tag])

  useEffect(() => {
    !!articles &&
      setArticlesWithLabels(
        articles.map((a) => new ArticleWithLabels(a, label)),
      )
  }, [articles, label])

  return (
    <>
      <PageHead
        title={`Culinary Canvas — #${tag} (${articles.length} articles)`}
        image={articles[0]?.imageContent.url}
        imageWidth={articles[0]?.imageContent.set.width}
        imageHeight={articles[0]?.imageContent.set.height}
        imageAlt={articles[0]?.imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <h1>#{tag}</h1>
        <ArticleGrid
          initialArticles={articlesWithLabels}
          load={async (last) =>
            !!last &&
            (
              await ArticleApi.publishedByTagPagedBySortOrderDesc(
                tag,
                PAGE_SIZE,
                last.article.sortOrder,
              )
            ).map((a) => new ArticleWithLabels(a, label))
          }
        />
      </main>
    </>
  )
}

interface StaticProps {
  tag: string
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  const { firestore } = initFirebase()
  const response = await firestore().collection('articles').get()
  const tags = response.docs.flatMap((d) => d.data().tagNames)
  return {
    paths: tags.map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  Props & { [key: string]: any },
  StaticProps
> = async ({ params }) => {
  const { firestore } = initFirebase()

  const response = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .where('tagNames', 'array-contains', params.tag)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()
  const articlesData = !!response.size
    ? response.docs
        .map((d) => d.data())
        .filter((a) => ArticleService.rawArticleIsPublished(a))
    : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      tag: params.tag,
    },
    revalidate: 1,
  }
}

export default ArticlesByTag
