import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../shared/button/Button'
import { useRouter } from 'next/router'
import { ArticleModel } from '../models/Article.model'
import { useAuth } from '../../services/auth/Auth'
import s from './ArticleView.module.scss'
import { Section } from '../section/Section'
import { ArticleFooter } from '../shared/footer/ArticleFooter'
import { RelatedArticles } from '../related/RelatedArticles'
import { useOnScrollIntoView } from '../../hooks/useOnScrollIntoView'
import { Spinner } from '../../shared/spinner/Spinner'
import { ArticleService } from '../Article.service'

interface Props {
  article: ArticleModel
}

export const ArticleView = observer(({ article: propArticle }: Props) => {
  const router = useRouter()
  const auth = useAuth()

  const relatedRef = useRef<HTMLElement>()
  const [showRelated, setShowRelated] = useState<boolean>(false)
  const [article, setArticle] = useState<ArticleModel>(propArticle)

  useOnScrollIntoView(
    relatedRef.current,
    async () => {
      if (!article.isPopulated) {
        await ArticleService.populate(article)
        setArticle(article)
      }
      setShowRelated(true)
    },
    [article],
    {
      relativeOffset: 0.9,
    },
  )

  useEffect(() => setArticle(propArticle), [propArticle])

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

      <section ref={relatedRef}>
        {showRelated ? <RelatedArticles article={article} /> : <Spinner />}
      </section>
    </>
  )
})
