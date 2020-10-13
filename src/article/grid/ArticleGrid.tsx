import React, { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react'
import { ArticleModel } from '../Article.model'
import styles from './ArticleGrid.module.scss'
import { classnames } from '../../services/importHelpers'
import Link from 'next/link'
import { ArticlePreview } from './articlePreview/ArticlePreview'
import { ArticleApi } from '../Article.api'
import { Transformer } from '../../services/db/Transformer'

interface Props {
  articles: ArticleModel[]
}

export const ArticleGrid = observer((props: Props) => {
  const { articles } = props

  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <Link
          href="/articles/[slug]"
          as={`/articles/${article.slug}`}
          key={article.id}
        >
          <a
            className={classnames(styles.article, {
              [styles.promoted]: article.promoted,
            })}
          >
            <ArticlePreview article={article} />
          </a>
        </Link>
      ))}
    </div>
  )
})
