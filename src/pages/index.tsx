import React, { useCallback, useEffect, useRef, useState } from 'react'
import s from './start.module.scss'
import { GetStaticProps } from 'next'
import { classnames } from '../services/importHelpers'
import { ArticleModel } from '../article/Article.model'
import { PageHead } from '../head/PageHead'
import { ArticleApi } from '../article/Article.api'
import { ArticleGrid } from '../article/grid/ArticleGrid'
import { Transformer } from '../services/db/Transformer'
import { Spinner } from '../shared/spinner/Spinner'
import { COLOR } from '../styles/color'

interface Props {
  articlesData: Partial<ArticleModel>[]
}

const PAGE_SIZE = 2

function Start({ articlesData }: Props) {
  const endRef = useRef<HTMLDivElement>()
  const [loading, setLoading] = useState<boolean>(false)
  const [endReached, setEndReached] = useState<boolean>(false)
  const [articles, setArticles] = useState<ArticleModel[]>(
    Transformer.allToApp(articlesData, ArticleModel),
  )

  const onScroll = useCallback(async () => {
    if (
      !endReached &&
      !loading &&
      scrollY + window.innerHeight * 1.5 > endRef.current.offsetTop
    ) {
      setLoading(true)

      const articlesToAddData = await ArticleApi.publishedPagedBySortOrder(
        PAGE_SIZE,
        articles[articles.length - 1].sortOrder,
      )

      if (!!articlesToAddData.length) {
        const transformed = Transformer.allToApp(
          articlesToAddData,
          ArticleModel,
        )
        if (transformed[transformed.length - 1].sortOrder === 0) {
          setEndReached(true)
        }
        setArticles([...articles, ...transformed])
        setLoading(false)
      }
    }
  }, [loading, endReached])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  return (
    <>
      <PageHead
        image={articles[0].imageContent.url}
        imageAlt={articles[0].imageContent.alt}
      />
      <main className={classnames(s.container)}>
        <ArticleGrid articles={articles} />
        <div
          id="end"
          ref={endRef}
          className={classnames(s.end, { [s.loading]: loading })}
        >
          {loading && <Spinner size={64} color={COLOR.GREY} />}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articlesData = await ArticleApi.publishedPagedBySortOrder(PAGE_SIZE)

  return {
    props: {
      articlesData,
    },
    revalidate: 1,
  }
}

export default Start
