import React, { useEffect, useState } from 'react'
import s from './articlesByCompany.module.scss'
import { GetServerSideProps, GetStaticProps } from 'next'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { ArticleModel } from '../../../article/models/Article.model'
import { PageHead } from '../../../shared/head/PageHead'
import { classnames, isNil } from '../../../services/importHelpers'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { initFirebase } from '../../../services/firebase/Firebase'
import { useRouter } from 'next/router'
import { isServer } from '../../_app'
import { CompanyModel } from '../../../company/models/Company.model'
import { ArticleWithLabels } from '../../../article/models/ArticleWithLabels'
import { ArticleLabel } from '../../../article/models/ArticleLabel'
import { CompanyView } from '../../../company/view/CompanyView'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { ArticleService } from '../../../article/Article.service'

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

  if (router.isFallback) {
    if (isServer) {
      return null
    }
    router.replace('/')
    return null
  }

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

  const { firestore } = initFirebase()
  const companyResponse = await firestore()
    .collection('companies')
    .where('slug', '==', params.slug)
    .get()

  const companyData: { [key: string]: any } = {
    ...companyResponse.docs[0].data(),
    id: companyResponse.docs[0].id,
  }

  const articlesResponse = await firestore()
    .collection('articles')
    .where('published', '==', true)
    .where('companyIds', 'array-contains', companyData.id)
    .orderBy('sortOrder', 'desc')
    .limit(PAGE_SIZE)
    .get()

  const articlesData = !!articlesResponse.size
    ? articlesResponse.docs
        .map((d) => d.data())
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
