import React, { useEffect } from 'react'
import s from './articlesByCompany.module.scss'
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
import { CompanyModel } from '../../../company/Company.model'

interface Props {
  articlesData: any[]
  companyData: any
}

const PAGE_SIZE = 6

function ArticlesByCompany({ articlesData, companyData }: Props) {
  const articles = useTransformToModel(articlesData, ArticleModel)
  const company = useTransformToModel([companyData], CompanyModel)[0]

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
        title={`Culinary Canvas — #${company.name} (${articles.length} articles)`}
        image={company.image?.cropped?.url || articles[0]?.imageContent.url}
        imageWidth={
          company.image?.cropped?.width ||
          articles[0]?.imageContent.set.cropped.width
        }
        imageHeight={
          company.image?.cropped?.height ||
          articles[0]?.imageContent.set.cropped.height
        }
        imageAlt={company.image?.alt || articles[0]?.imageContent.set.alt}
      />

      <main className={classnames(s.container)}>
        <ArticleGrid
          initialArticles={articles}
          load={async (last) =>
            ArticleApi.publishedByCompanyIdPagedBySortOrderDesc(
              company.id,
              PAGE_SIZE,
              last.sortOrder,
            )
          }
          labels={[
            { label: company.name, path: `/articles/company/${company.slug}` },
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
  const response = await firestore().collection('companies').get()
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

  const companyResponse = await firestore()
    .collection('companies')
    .where('slug', '==', params.slug)
    .get()

  const companyData = companyResponse.docs[0].data()

  const articlesResponse = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .where('companyIds', 'array-contains', companyData.id)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()

  const articlesData = !!articlesResponse.size
    ? articlesResponse.docs.map((d) => d.data())
    : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      companyData: JSON.parse(JSON.stringify(companyData)),
    },
    revalidate: 1,
  }
}

export default ArticlesByCompany
