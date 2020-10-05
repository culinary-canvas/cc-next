import React from 'react'
import { useObserver } from 'mobx-react'
import { Article as ArticleModel } from '../../domain/Article/Article'
import './ArticleGrid.module.scss'
import { PreviewSection } from './PreviewSection'
import { classnames } from '../../services/importHelpers'
import Link from 'next/Link'

interface Props {
  articles: ArticleModel[]
}

export const ArticleGrid = (props: Props) => {
  const { articles } = props

  return useObserver(() => (
    <div className="content grid">
      {articles.map((article) => (
        <Link href={`/article/${article.titleForUrl}`} key={article.id}>
          <a
            className={classnames('article', 'container', {
              promoted: article.promoted,
            })}
          >
            <article
              className={classnames('article', 'content', {
                promoted: article.promoted,
              })}
            >
              <PreviewSection article={article} />
            </article>
          </a>
        </Link>
      ))}
    </div>
  ))
}
