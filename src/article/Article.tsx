import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../form/button/Button'
import { useRouter } from 'next/router'
import { ArticleModel } from './Article.model'
import { useAuth } from '../services/auth/Auth'
import s from './Article.module.scss'
import { Section } from './section/Section'
import { ArticleFooter } from './shared/ArticleFooter'
import { RelatedArticles } from './related/RelatedArticles'
import { useOnScrollIntoView } from '../hooks/useOnScrollIntoView'
import { Spinner } from '../shared/spinner/Spinner'
import { ArticleService } from './Article.service'

interface Props {
  article: ArticleModel
}

export const Article = observer(({ article }: Props) => {
  const router = useRouter()
  const auth = useAuth()

  const relatedRef = useRef<HTMLElement>()
  const [showRelated, setShowRelated] = useState<boolean>(false)

  useOnScrollIntoView(
    relatedRef.current,
    () => {
      setShowRelated(true)
    },
    {
      relativeOffset: 0.9,
    },
  )

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
