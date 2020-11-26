import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { ArticleModel } from '../Article.model'
import styles from './ArticleGrid.module.scss'
import { classnames } from '../../services/importHelpers'
import Link from 'next/link'
import { ArticlePreview } from './articlePreview/ArticlePreview'
import s from '../../pages/start.module.scss'
import { Spinner } from '../../shared/spinner/Spinner'
import { COLOR } from '../../styles/color'
import { Transformer } from '../../services/db/Transformer'

interface Props {
  initialArticles: ArticleModel[]
  load: (lastLoaded: ArticleModel) => Promise<ArticleModel[] | null>
}

export const ArticleGrid = observer((props: Props) => {
  const { initialArticles, load: loadFn } = props

  const endRef = useRef<HTMLDivElement>()
  const [loading, setLoading] = useState<boolean>(false)
  const [endReached, setEndReached] = useState<boolean>(false)
  const [articles, setArticles] = useState<ArticleModel[]>(initialArticles)

  useEffect(() => {
    setArticles(initialArticles)
    setEndReached(false)
  }, [initialArticles])

  // Trigger next load when initial load fits the screen (only triggered on scroll now)
  const onScroll = useCallback(() => {
    if (
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

    if (!!articlesToAddData) {
      const transformed = Transformer.allToApp(articlesToAddData, ArticleModel)
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
    <div className={styles.grid}>
      {articles.map((article, i) => (
        <Link
          href="/articles/[slug]"
          as={`/articles/${article.slug}`}
          key={article.id}
        >
          <a
            className={classnames(styles.article, {
              [styles.promoted]: article.promoted || i === 0,
            })}
          >
            <ArticlePreview article={article} first={i === 0}/>
          </a>
        </Link>
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
