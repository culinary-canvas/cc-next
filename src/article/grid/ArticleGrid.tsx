import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ArticleModel } from '../models/Article.model'
import s from './ArticleGrid.module.scss'
import { classnames } from '../../services/importHelpers'
import Link from 'next/link'
import { ArticlePreview } from '../preview/ArticlePreview'
import { Spinner } from '../../shared/spinner/Spinner'
import { COLOR } from '../../styles/_color'
import { ArticleWithLabels } from '../models/ArticleWithLabels'

interface Props<T extends ArticleModel | ArticleWithLabels> {
  initialArticles?: T[]
  load?: (last: T) => Promise<T[]>
  insertComponent?: () => any
  insertComponentAtIndex?: number
  usePromoted?: boolean
  className?: string
  preloadImages?: boolean
  preloadLimit?: number
}

export const ArticleGrid = observer(
  <T extends ArticleModel | ArticleWithLabels>(props: Props<T>) => {
    const {
      initialArticles = [],
      load: loadFn,
      insertComponent = false,
      insertComponentAtIndex = 0,
      usePromoted = false,
      className,
      preloadImages = false,
      preloadLimit,
    } = props
    const endRef = useRef<HTMLDivElement>()
    const [loading, setLoading] = useState<boolean>(false)
    const [allLoaded, setAllLoaded] = useState<boolean>(false)
    const [articles, setArticles] = useState<T[]>(initialArticles)

    useEffect(() => {
      setArticles(initialArticles)
      setAllLoaded(false)
    }, [initialArticles])

    const load = useCallback(async () => {
      if (!!loadFn) {
        setLoading(true)
        const articlesToAdd = await loadFn(articles[articles.length - 1])
        if (!!articlesToAdd.length) {
          setArticles([...articles, ...articlesToAdd])
        } else {
          setAllLoaded(true)
        }

        setLoading(false)
      }
    }, [articles, loadFn])

    // TODO: Also trigger next load when initial load fits the screen (only triggered on scroll now)
    const onScroll = useCallback(() => {
      if (
        !!endRef.current &&
        !allLoaded &&
        !loading &&
        scrollY + window.innerHeight > endRef.current.offsetTop * 0.8
      ) {
        load()
      }
    }, [loading, allLoaded, load])

    useEffect(() => {
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }, [onScroll])

    return (
      <>
        <div className={classnames(s.grid, className)}>
          {articles.map((a, i) => {
            const article =
              a instanceof ArticleWithLabels ? a.article : (a as ArticleModel)
            const labels = a instanceof ArticleWithLabels ? a.labels : null

            return (
              <React.Fragment key={i}>
                {!!insertComponent &&
                  i === insertComponentAtIndex &&
                  insertComponent()}
                <Link href={`/articles/${article.slug}`}>
                  <a
                    className={classnames(s.articleContainer, {
                      [s.promoted]:
                        usePromoted && (article.promoted || i === 0),
                    })}
                  >
                    <ArticlePreview
                      article={article}
                      first={i === 0}
                      labels={labels}
                      preloadImage={
                        preloadImages && !!preloadLimit
                          ? i < preloadLimit
                          : true
                      }
                    />
                  </a>
                </Link>
              </React.Fragment>
            )
          })}
        </div>
        <div
          id="end"
          ref={endRef}
          className={classnames(s.end, { [s.loading]: loading })}
        >
          {loading && <Spinner size={64} color={COLOR.GREY} />}
        </div>
      </>
    )
  },
)
