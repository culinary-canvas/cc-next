import React, { useEffect } from 'react'
import s from './articlesByPerson.module.scss'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { ArticleModel } from '../../../article/Article.model'
import { PageHead } from '../../../head/PageHead'
import { classnames } from '../../../services/importHelpers'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../../_app'
import { PersonModel } from '../../../person/Person.model'

interface Props {
  articlesData: any[]
  personData: any
}

const PAGE_SIZE = 6

function ArticlesByPerson({ articlesData, personData }: Props) {
  const articles = useTransformToModel(articlesData, ArticleModel)
  const person = useTransformToModel([personData], PersonModel)[0]

  const router = useRouter()
  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

  return (
    <>
      <PageHead
        title={`Culinary Canvas — #${person.name} (${articles.length} articles)`}
        image={person.image?.cropped?.url || articles[0].imageContent.url}
        imageWidth={
          person.image?.cropped?.width ||
          articles[0].imageContent.set.cropped.width
        }
        imageHeight={
          person.image?.cropped?.height ||
          articles[0].imageContent.set.cropped.height
        }
        imageAlt={person.image?.alt || articles[0].imageContent.set.alt}
      />

      <main className={classnames(s.container)}>
        <ArticleGrid
          initialArticles={articles}
          load={async (last) =>
            ArticleApi.publishedByPersonIdPagedBySortOrderDesc(
              person.id,
              PAGE_SIZE,
              last.sortOrder,
            )
          }
          labels={[
            { label: person.name, path: `/persons/${person.slug}` },
          ]}
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

  const personData = personResponse.docs[0].data()

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
