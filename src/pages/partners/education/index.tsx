import { GetStaticProps } from 'next'
import { PageHead } from '../../../shared/head/PageHead'
import React, { useEffect } from 'react'
import s from './education.module.scss'
import { firebase } from '../../../services/firebase/Firebase'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { ArticleModel } from '../../../article/models/Article.model'
import { useRouter } from 'next/router'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { isServer } from '../../_app'
import { useMenu } from '../../../menu/Menu.context'
import { menuOptions } from '../../../menu/models/menuOptions'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { CompanyModel } from '../../../company/models/Company.model'
import { CompanyView } from '../../../company/view/CompanyView'
import { LeadForm } from '../../../shared/leadForm/LeadForm'
import { ArticleService } from '../../../article/Article.service'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { CompanyApi } from '../../../company/Company.api'

const PAGE_SIZE = 6

interface Props {
  articlesData: any[]
  companyData: any
}

export default function Education({ articlesData, companyData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)
  const company = useTransformToModel(companyData, CompanyModel)
  const router = useRouter()

  const { setActiveMenuOption } = useMenu()
  useEffect(() => {
    setActiveMenuOption(menuOptions.PARTNERS.subMenu[0])
  }, [])

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
        title={`Culinary Canvas — Partners — Education`}
        image={company.imageSet?.url || articles[0]?.imageContent.url}
        imageWidth={
          company.imageSet?.width || articles[0]?.imageContent.set.width
        }
        imageHeight={
          company.imageSet?.height || articles[0]?.imageContent.set.height
        }
        imageAlt={company.imageSet?.alt || articles[0]?.imageContent.set.alt}
      />
      <main className={s.container}>
        <div className={s.content}>
          <CompanyView company={company} className={s.presentation} />
          <div className={s.formContainer}>
            <LeadForm />
          </div>
        </div>
        <h2>Articles</h2>
        <ArticleGrid
          initialArticles={articles}
          load={async (last) =>
            !!last &&
            (await ArticleApi.publishedByCompanyIdPagedBySortOrderDesc(
              company.id,
              PAGE_SIZE,
              last.sortOrder,
            ))
          }
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { db } = firebase()

  const companyResponse = await getDocs(
    query(
      collection(db, CompanyApi.COLLECTION),
      where('slug', '==', 'culinary-arts-academy-switzerland-caas'),
    ),
  )

  const companyData: { [key: string]: any } = {
    ...companyResponse.docs[0].data(),
    id: companyResponse.docs[0].id,
  }

  const articlesResponse = await getDocs(
    query(
      collection(db, ArticleApi.COLLECTION),
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
      companyData: JSON.parse(JSON.stringify(companyData)),
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
    revalidate: 1,
  }
}
