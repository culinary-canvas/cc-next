import React, { useEffect, useState } from 'react'
import s from './articlesByPerson.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { ArticleModel } from '../../../article/models/Article.model'
import { PageHead } from '../../../shared/head/PageHead'
import { classnames, isNil } from '../../../services/importHelpers'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../../_app'
import { PersonModel } from '../../../person/models/Person.model'
import { PersonView } from '../../../person/view/PersonView'
import { ArticleWithLabels } from '../../../article/models/ArticleWithLabels'
import { ArticleLabel } from '../../../article/models/ArticleLabel'
import { useTransformToModels } from '../../../hooks/useTransformToModels'

interface Props {
  articlesData: any[]
  personData: any
}

const PAGE_SIZE = 6

function ArticlesByPerson({ articlesData, personData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const person = useTransformToModel(personData, PersonModel)
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

  useEffect(
    () =>
      !!person &&
      setLabel(
        new ArticleLabel(person.name, `/articles/persons/${person.slug}`),
      ),
    [person],
  )

  useEffect(() => {
    !!articles &&
      !!label &&
      setArticlesWithLabels(
        articles.map((a) => new ArticleWithLabels(a, label)),
      )
  }, [articles, label])

  return (
    <>
      <PageHead
        title={`Culinary Canvas — #${person.name} (${
          !isNil(articles) ? articles.length : 0
        } articles)`}
        image={person.image?.cropped?.url || articles[0]?.imageContent.url}
        imageWidth={
          person.image?.cropped?.width ||
          articles[0]?.imageContent.set.cropped.width
        }
        imageHeight={
          person.image?.cropped?.height ||
          articles[0]?.imageContent.set.cropped.height
        }
        imageAlt={person.image?.alt || articles[0]?.imageContent.set.alt}
      />

      <main className={classnames(s.container)}>
        <PersonView person={person} className={s.presentation} />
        <h2>Articles</h2>
        <ArticleGrid
          initialArticles={articlesWithLabels}
          load={async (last) =>
            !!last &&
            (
              await ArticleApi.publishedByPersonIdPagedBySortOrderDesc(
                person.id,
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
  slug: string
  [key: string]: string
}

export const getStaticPaths: GetStaticPaths<StaticProps> = async () => {
  const { firestore } = initFirebase()
  const response = await firestore().collection('persons').get()
  return {
    paths: response.docs.map((d) => ({
      params: {
        slug: d.data().slug,
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

  const personResponse = await firestore()
    .collection('persons')
    .where('slug', '==', params.slug)
    .get()

  const personData: { [key: string]: any } = {
    ...personResponse.docs[0].data(),
    id: personResponse.docs[0].id,
  }

  const articlesResponse = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .where('personIds', 'array-contains', personData.id)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()
  const articlesData = !!articlesResponse.size
    ? articlesResponse.docs.map((d) => d.data())
    : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      personData: JSON.parse(JSON.stringify(personData)),
    },
    revalidate: 1,
  }
}

export default ArticlesByPerson
