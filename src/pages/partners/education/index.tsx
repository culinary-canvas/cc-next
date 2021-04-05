import { GetStaticProps } from 'next'
import { PageHead } from '../../../head/PageHead'
import React, { useEffect } from 'react'
import s from './education.module.scss'
import { initFirebase } from '../../../services/firebase/Firebase'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { ArticleModel } from '../../../article/Article.model'
import { useRouter } from 'next/router'
import { ArticleGrid } from '../../../article/grid/ArticleGrid'
import ArticleApi from '../../../article/Article.api'
import { isServer } from '../../_app'
import { useMenu } from '../../../menu/Menu.context'
import { menuOptions } from '../../../menu/menuOptions'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { CompanyModel } from '../../../company/Company.model'
import { Company } from '../../../company/Company'

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
      <main className={s.container}>
        <Company company={company} className={s.presentation} />

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
  const { firestore } = initFirebase()

  const companyResponse = await firestore()
    .collection('companies')
    .where('slug', '==', 'culinary-arts-academy-switzerland-caas')
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
    ? articlesResponse.docs.map((d) => d.data())
    : []

  return {
    props: {
      companyData: JSON.parse(JSON.stringify(companyData)),
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
  }
}
