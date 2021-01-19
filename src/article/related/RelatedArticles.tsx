import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArticleModel } from '../Article.model'
import s from './RelatedArticle.module.scss'
import ArticleApi from '../Article.api'
import {
  ArticleLabel,
  ArticlePreview,
} from '../grid/articlePreview/ArticlePreview'

interface Props {
  article: ArticleModel
}

interface ArticlesWithLabels {
  article: ArticleModel
  labels: ArticleLabel[]
}

export function RelatedArticles({ article }: Props) {
  const [articles, setArticles] = useState<ArticlesWithLabels[]>([])

  const load = useCallback(async () => {
    let _articles: ArticlesWithLabels[] = []
    if (!!article.companyIds?.length) {
      const companyArticles = await ArticleApi.byCompanyIds(article.companyIds)

      companyArticles.forEach((ca) => {
        const labels = article.companies.map((c) => ({
          label: c.name,
          path: `/companies/${c.name}`,
        }))

        if (!_articles.some((a) => a.article.id === ca.id)) {
          _articles.push({
            article: ca,
            labels,
          })
        } else {
          const withLabels = _articles.find((a) => a.article.id === ca.id)
          withLabels.labels = [...withLabels.labels, ...labels]
        }
      })
      setArticles(_articles.filter((a) => a.article.id !== article.id))
    }

    if (!!article.personIds?.length) {
      _articles = [..._articles]
      const personArticles = await ArticleApi.byPersonIds(article.personIds)

      personArticles.forEach((ca) => {
        const labels = article.persons.map((c) => ({
          label: c.name,
          path: `/persons/${c.name}`,
        }))
        if (!_articles.some((a) => a.article.id === ca.id)) {
          _articles.push({
            article: ca,
            labels,
          })
        } else {
          const withLabels = _articles.find((a) => a.article.id === ca.id)
          withLabels.labels = [...withLabels.labels, ...labels]
        }
      })
      setArticles(_articles.filter((a) => a.article.id !== article.id))
    }

    if (!!article.tagNames?.length) {
      _articles = [..._articles]
      const tagArticles = await ArticleApi.byTagNames(article.tagNames)

      tagArticles.forEach((ca) => {
        const labels = article.tagNames
          .filter((t) => article.tagNames.includes(t))
          .map((t) => ({ label: `#${t}`, path: `/tags/${t}` }))
        if (!_articles.some((a) => a.article.id === ca.id)) {
          _articles.push({
            article: ca,
            labels,
          })
        } else {
          const withLabels = _articles.find((a) => a.article.id === ca.id)
          withLabels.labels = [...withLabels.labels, ...labels]
        }
      })
      setArticles(_articles.filter((a) => a.article.id !== article.id))
    }
  }, [])

  useEffect(() => void load(), [])

  return (
    <>
      <div className={s.container}>
        <h2>Want more?</h2>
        <p>Here are some other articles that we think you might enjoy.</p>
        <p>
          Do you think we're missing something? Send us an{' '}
          <a href="mailto:info@culinary-canvas.com">email</a> and tell us what
          you want to read about
        </p>
        <div className={s.list}>
          {articles.map((a) => (
            <Link href={`/articles/${a.article.slug}`} key={a.article.id}>
              <a>
                <ArticlePreview
                  article={a.article}
                  className={s.articlePreview}
                  labels={a.labels}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
