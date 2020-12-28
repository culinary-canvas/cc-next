import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { ArticleModel } from '../Article.model'
import s from './ArticleGrid.module.scss'
import { classnames } from '../../services/importHelpers'
import Link from 'next/link'
import { ArticlePreview } from './articlePreview/ArticlePreview'
import { Spinner } from '../../shared/spinner/Spinner'
import { COLOR } from '../../styles/_color'
import { Transformer } from '../../services/db/Transformer'
import { Splash } from './splash/Splash'

interface Props {
  initialArticles?: ArticleModel[]
  load: (last: ArticleModel) => Promise<ArticleModel[]>
  showSplash?: boolean
}

export const ArticleGrid = observer((props: Props) => {
  const { initialArticles = [], load: loadFn, showSplash = false } = props
  const endRef = useRef<HTMLDivElement>()
  const [loading, setLoading] = useState<boolean>(false)
  const [endReached, setEndReached] = useState<boolean>(false)
  const [articles, setArticles] = useState<ArticleModel[]>(initialArticles)

  useEffect(() => {
    setArticles(initialArticles)
    setEndReached(false)
  }, [initialArticles])

  // TODO: Also trigger next load when initial load fits the screen (only triggered on scroll now)
  const onScroll = useCallback(() => {
    if (
      !!endRef.current &&
      !endReached &&
      !loading &&
      scrollY + window.innerHeight * 1.5 > endRef.current.offsetTop
    ) {
      load()
    }
  }, [loading, endReached])

  const load = useCallback(async () => {
    setLoading(true)
    const articlesToAddData = await loadFn(articles[articles.length - 1])

    if (!!articlesToAddData.length) {
      const transformed = Transformer.dbToModels(
        articlesToAddData,
        ArticleModel,
      )
      setArticles([...articles, ...transformed])
    } else {
      setEndReached(true)
    }

    setLoading(false)
  }, [articles])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  return (
    <div className={s.grid}>
      {articles.map((article, i) => (
        <React.Fragment key={i}>
          {showSplash && i === 1 && <Splash />}
          <Link href="/articles/[slug]" as={`/articles/${article.slug}`}>
            <a
              className={classnames(s.articleContainer, {
                [s.promoted]: article.promoted || i === 0,
              })}
            >
              <ArticlePreview article={article} priority={i === 0} />
            </a>
          </Link>
        </React.Fragment>
      ))}
      <div
        id="end"
        ref={endRef}
        className={classnames(s.end, { [s.loading]: loading })}
      >
        {loading && <Spinner size={64} color={COLOR.GREY} />}
      </div>
    </div>
  )
})
