import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ArticleApi from '../../../article/Article.api'
import { ArticleService } from '../../../article/Article.service'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import { ArticleModel } from '../../../article/models/Article.model'
import { ArticleLabel } from '../../../article/models/ArticleLabel'
import { ArticleWithLabels } from '../../../article/models/ArticleWithLabels'
import { CompanyModel } from '../../../company/models/Company.model'
import { CompanyView } from '../../../company/view/CompanyView'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { firebase } from '../../../services/firebase/Firebase'
import { classnames, isNil } from '../../../services/importHelpers'
import { PageHead } from '../../../shared/head/PageHead'
import { isServer } from '../../_app'
import s from './articlesByCompany.module.scss'

interface Props {
  articlesData: any[]
  companyData: any
}

const PAGE_SIZE = 6

function ArticlesByCompany({ articlesData, companyData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const company = useTransformToModel(companyData, CompanyModel)
  const router = useRouter()

  const [articlesWithLabels, setArticlesWithLabels] = useState<
    ArticleWithLabels[]
  >([])
  const [label, setLabel] = useState<ArticleLabel>()

  useEffect(() => window.scrollTo({ behavior: 'smooth', top: 0 }), [])

  useEffect(
    () =>
      !!company &&
      setLabel(new ArticleLabel(company.name, `/companies/${company.slug}`)),
    [company],
  )

  useEffect(() => {
    !!articles &&
      !!company &&
      setArticlesWithLabels(
        articles.map((a) => new ArticleWithLabels(a, label)),
      )
  }, [articles, company, label])

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
        title={`Culinary Canvas — #${company.name} (${
          !isNil(articles) ? articles.length : 0
        } articles)`}
        image={company.imageSet?.url || articles[0]?.imageContent.url}
        imageWidth={
          company.imageSet?.width || articles[0]?.imageContent.set.width
        }
        imageHeight={
          company.imageSet?.height || articles[0]?.imageContent.set.height
        }
        imageAlt={company.imageSet?.alt || articles[0]?.imageContent.set.alt}
      />

      <main className={classnames(s.container)}>
        <CompanyView company={company} className={s.presentation} />
        <h2>Articles</h2>
        <ArticleGrid
          initialArticles={articlesWithLabels}
          load={async (last) =>
            !!last &&
            (
              await ArticleApi.publishedByCompanyIdPagedBySortOrderDesc(
                company.id,
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (params.slug === 'culinary-arts-academy-switzerland-caas') {
    return {
      redirect: {
        permanent: true,
        destination: '/partners/education',
      },
    }
  }

  const { db } = firebase()
  const companyResponse = await getDocs(
    query(collection(db, 'companies'), where('slug', '==', params.slug)),
  )

  const companyData: { [key: string]: any } = {
    ...companyResponse.docs[0].data(),
    id: companyResponse.docs[0].id,
  }

  const articlesResponse = await getDocs(
    query(
      collection(db, 'articles'),
      where('published', '==', true),
      where('companyIds', 'array-contains', companyData.id),
      orderBy('sortOrder', 'desc'),
      limit(PAGE_SIZE),
    ),
  )

  const articlesData = !!articlesResponse.size
    ? articlesResponse.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => ArticleService.rawArticleIsPublished(a))
    : []

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
      companyData: JSON.parse(JSON.stringify(companyData)),
    },
  }
}

export default ArticlesByCompany
