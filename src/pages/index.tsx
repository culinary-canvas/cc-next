import { GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { ArticleApi } from '../article/Article.api'
import { ArticleService } from '../article/Article.service'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import { Splash } from '../article/grid/splash/Splash'
import { ArticleModel } from '../article/models/Article.model'
import { useTransformToModels } from '../hooks/useTransformToModels'
import { useMenu } from '../menu/Menu.context'
import { menuOptions } from '../menu/models/menuOptions'
import { classnames } from '../services/importHelpers'
import { PageHead } from '../shared/head/PageHead'
import s from './start.module.scss'

interface Props {
  articlesData: any[]
}

const PAGE_SIZE = 9

function Start({ articlesData }: Props) {
  const articles = useTransformToModels(articlesData, ArticleModel)

  useEffect(() => {
    ArticleService.populateIssues(articles)
  }, [articles])

  const { setActiveMenuOption } = useMenu()
  useEffect(() => setActiveMenuOption(menuOptions.ALL), [])

  return (
    <>
      <PageHead
        image={articles[0].imageContent.url}
        imageWidth={articles[0].imageContent.set.width}
        imageHeight={articles[0].imageContent.set.height}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid
          insertComponent={() => <Splash />}
          insertComponentAtIndex={1}
          useBig
          useFirst
          initialArticles={articles}
          load={async (lastLoaded) =>
            ArticleApi.publishedPagedBySortOrderDesc(
              PAGE_SIZE,
              lastLoaded.sortOrder,
            )
          }
          preloadImages
          preloadLimit={PAGE_SIZE}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const articlesData = await ArticleApi.fetchRawArticles(PAGE_SIZE)

  return {
    props: {
      articlesData: JSON.parse(JSON.stringify(articlesData)),
    },
    revalidate: 1,
  }
}

export default Start
