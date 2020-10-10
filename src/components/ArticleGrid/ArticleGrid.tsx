import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Article } from '../../domain/Article/Article'
import styles from './ArticleGrid.module.scss'
import { classnames } from '../../services/importHelpers'
import Link from 'next/Link'
import { PreviewArticle } from './PreviewArticle'

interface Props {
  articles: Article[]
}

export const ArticleGrid = observer((props: Props) => {
  const { articles } = props

  const [sorted, setSorted] = useState<Article[]>(articles)

  useEffect(() => {
    setSorted(articles.slice().sort((a1, a2) => a2.sortOrder - a1.sortOrder))
  }, [articles])

  return (
    <div className={styles.grid}>
      {sorted.map((article) => (
        <Link href="/articles/[slug]" as={`/articles/${article.slug}`} key={article.id}>
          <a
            className={classnames(styles.article, {
              [styles.promoted]: article.promoted,
            })}
          >
            <PreviewArticle article={article} />
          </a>
        </Link>
      ))}
    </div>
  )
})
