import React, { useCallback, useEffect, useState } from 'react'
import { ArticleModel } from '../Article.model'
import s from './RelatedArticle.module.scss'
import { PersonApi } from '../../person/Person.api'
import ArticleApi from '../Article.api'
import { ArticlePreview } from '../grid/articlePreview/ArticlePreview'
import { CompanyApi } from '../../company/Company.api'

interface Props {
  article: ArticleModel
}

interface ArticlesWithLabels {
  article: ArticleModel
  labels: string[]
}

export function RelatedArticles({ article }: Props) {
  const [articles, setArticles] = useState<ArticlesWithLabels[]>([])

  const load = useCallback(async () => {
    if (!!article.personIds?.length) {
      let _articles: ArticlesWithLabels[] = []
      const companies = await CompanyApi.byIds(article.companyIds)
      const companyArticles = await ArticleApi.byCompanyIds(article.companyIds)

      companyArticles.forEach((ca) => {
        const labels = companies
          .filter((c) => article.companyIds.includes(c.id))
          .map((c) => c.name)
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
      setArticles(_articles)

      _articles = [..._articles]
      const _persons = await PersonApi.byIds(article.personIds)
      const personArticles = await ArticleApi.byPersonIds(article.personIds)
      console.log(personArticles)

      personArticles.forEach((ca) => {
        const labels = _persons
          .filter((c) => article.personIds.includes(c.id))
          .map((c) => c.name)
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
      setArticles(_articles)

      _articles = [..._articles]
      const tagArticles = await ArticleApi.byTagNames(article.tagNames)
      console.log(tagArticles)

      tagArticles.forEach((ca) => {
        const labels = article.tagNames
          .filter((t) => article.tagNames.includes(t))
          .map((t) => `#${t}`)
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
      setArticles(_articles)
    }
  }, [])

  useEffect(() => void load(), [])

  return (
    <>
      <div className={s.container}>
        <h1>Want more?</h1>
        <p>Here's some more reading for you to enjoy</p>
        <div className={s.list}>
          {articles.map((a) => (
            <ArticlePreview
              key={a.article.id}
              article={a.article}
              className={s.articlePreview}
              labels={a.labels}
            />
          ))}
        </div>
      </div>
    </>
  )
}
