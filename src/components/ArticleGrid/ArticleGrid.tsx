import React from 'react'
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

  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <Link href={`/articles/${article.titleForUrl}`} key={article.id}>
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
