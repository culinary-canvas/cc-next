import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../services/auth/Auth'
import { Button } from '../../shared/button/Button'
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
  const router = useRouter()
  const auth = useAuth()
  const [article, setArticle] = useState<ArticleModel>(propArticle)

  useEffect(() => setArticle(propArticle), [propArticle])

  console.debug('verifying')

  const loadRelated = useCallback(async () => {
    if (!article.isPopulated) {
      await ArticleService.populate(article)
      setArticle(article)
    }
  }, [article])

  return (
    <>
      {auth.isSignedIn && (
        <Button
          className={s.editButton}
          onClick={() => router.push(`/admin/articles/${article.slug}`)}
        >
          Edit
        </Button>
      )}
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
