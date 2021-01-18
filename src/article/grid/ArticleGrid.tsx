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
import { motion } from 'framer-motion'

interface Props {
  initialArticles?: ArticleModel[]
  load: (last: ArticleModel) => Promise<ArticleModel[]>
  showSplash?: boolean
  labels?: string[]
}

export const ArticleGrid = observer((props: Props) => {
  const {
    initialArticles = [],
    load: loadFn,
    labels,
    showSplash = false,
  } = props
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

  const variants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.5 },
    },
    hidden: { opacity: 0 },
  }

  return (
    <>
      <motion.div
        className={s.grid}
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {articles.map((article, i) => (
          <React.Fragment key={i}>
            {showSplash && i === 1 && <Splash />}
            <Link href={`/articles/${article.slug}`}>
              <motion.a
                variants={variants}
                className={classnames(s.articleContainer, {
                  [s.promoted]: article.promoted || i === 0,
                })}
              >
                <ArticlePreview
                  article={article}
                  priority={i === 0}
                  labels={labels}
                />
              </motion.a>
            </Link>
          </React.Fragment>
        ))}
      </motion.div>
      <div
        id="end"
        ref={endRef}
        className={classnames(s.end, { [s.loading]: loading })}
      >
        {loading && <Spinner size={64} color={COLOR.GREY} />}
      </div>
    </>
  )
})
