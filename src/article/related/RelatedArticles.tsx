import React, { useCallback, useEffect, useState } from 'react'
import { ArticleModel } from '../Article.model'
import s from './RelatedArticle.module.scss'
import ArticleApi from '../Article.api'
import { ArticleGrid } from '../grid/ArticleGrid'
import { ArticleWithLabels } from '../ArticleWithLabels'
import { ArticleLabel } from '../ArticleLabel'

interface Props {
  article: ArticleModel
}

export function RelatedArticles({ article }: Props) {
  const [articles, setArticles] = useState<ArticleWithLabels[]>([])

  const load = useCallback(async () => {
    const _articles: ArticleWithLabels[] = []

    if (!!article.companyIds?.length) {
      const companyArticles = await ArticleApi.byCompanyIds(article.companyIds)
      companyArticles
        .filter((companyArticle) => companyArticle.id !== article.id)
        .forEach(
          (companyArticle) =>
            _articles.some((a) => a.article.id === companyArticle.id) &&
            _articles.push(new ArticleWithLabels(companyArticle)),
        )
      article.companies.forEach((company) =>
        _articles
          .filter((a) => a.article.companyIds.includes(company.id))
          .forEach((a) =>
            a.labels.push(
              new ArticleLabel(company.name, `/companies/${company.slug}`),
            ),
          ),
      )
    }

    if (!!article.personIds?.length) {
      const personArticles = await ArticleApi.byPersonIds(article.personIds)
      personArticles
        .filter((personArticle) => personArticle.id !== article.id)
        .forEach(
          (personArticle) =>
            !_articles.some((a) => a.article.id === personArticle.id) &&
            _articles.push(new ArticleWithLabels(personArticle)),
        )
      article.persons.forEach((person) =>
        _articles
          .filter((a) => a.article.personIds.includes(person.id))
          .forEach((a) =>
            a.labels.push(
              new ArticleLabel(person.name, `/persons/${person.slug}`),
            ),
          ),
      )
    }

    if (!!article.tagNames?.length) {
      const tagArticles = await ArticleApi.byTagNames(article.tagNames)
      tagArticles
        .filter((tagArticle) => tagArticle.id !== article.id)
        .forEach(
          (tagArticle) =>
            !_articles.some((a) => a.article.id === tagArticle.id) &&
            _articles.push(new ArticleWithLabels(tagArticle)),
        )
      article.tagNames.forEach((tag) => {
        _articles
          .filter((a) => a.article.tagNames.includes(tag))
          .forEach((a) => a.labels.push(new ArticleLabel(tag, `/tags/${tag}`)))
      })
    }

    setArticles(_articles)
  }, [article])

  useEffect(() => void load(), [load])

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
        <ArticleGrid initialArticles={articles} />
      </div>
    </>
  )
}
