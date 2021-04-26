import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from '../../shared/button/Button'
import { useRouter } from 'next/router'
import { ArticleModel } from '../models/Article.model'
import { useAuth } from '../../services/auth/Auth'
import s from './ArticleView.module.scss'
import { Section } from '../section/Section'
import { ArticleFooter } from '../shared/footer/ArticleFooter'
import { RelatedArticles } from '../related/RelatedArticles'
import { ArticleService } from '../Article.service'
import { Related } from '../../shared/related/Related'

interface Props {
  article: ArticleModel
}

export const ArticleView = observer(({ article: propArticle }: Props) => {
  const router = useRouter()
  const auth = useAuth()
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
      {auth.isSignedIn && (
        <Button
          className={s.editButton}
          onClick={() => router.push(`/admin/articles/${article.slug}`)}
        >
          Edit
        </Button>
      )}
      <article
        className={s.content}
        style={{ backgroundColor: article.format.backgroundColor }}
      >
        {article.sections.map((section) => (
          <Section
            first={section.format.gridPosition.startRow === 1}
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
