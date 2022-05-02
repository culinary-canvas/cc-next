import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useState } from 'react'
import { Related } from '../../shared/related/Related'
import { ArticleService } from '../Article.service'
import { ArticleModel } from '../models/Article.model'
import { RelatedArticles } from '../related/RelatedArticles'
import { Section } from '../section/Section'
import { ArticleFooter } from '../shared/footer/ArticleFooter'
import s from './ArticleView.module.scss'

interface Props {
  article: ArticleModel
}

export const ArticleView = observer(({ article: propArticle }: Props) => {
  const [article, setArticle] = useState<ArticleModel>(propArticle)

  useEffect(() => setArticle(propArticle), [propArticle])

  const loadRelated = useCallback(async () => {
    if (!article.isPopulated) {
      await ArticleService.populate(article)
      setArticle(article)
    }
  }, [article])

  return (
    <>
      <article
        className={classNames(s.content, article.sponsored && s.sponsored)}
        style={{ backgroundColor: article.format.backgroundColor }}
      >
        {article.sections.map((section) => (
          <Section
            article={article}
            first={section.format.gridPosition?.startRow === 1}
            key={section.uid}
            section={section}
          />
        ))}
        <ArticleFooter article={article} />
      </article>

      <Related onInView={() => loadRelated()}>
        <RelatedArticles article={article} />
      </Related>
    </>
  )
})
