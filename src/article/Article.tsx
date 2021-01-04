import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../form/button/Button'
import { useRouter } from 'next/router'
import { ArticleModel } from './Article.model'
import { useAuth } from '../services/auth/Auth'
import s from './Article.module.scss'
import { Section } from './section/Section'
import { ArticleFooter } from './shared/ArticleFooter'
import { ArticleApi } from './Article.api'
import { Transformer } from '../services/db/Transformer'

interface Props {
  article: ArticleModel
}

export const Article = observer(({ article }: Props) => {
  const router = useRouter()
  const auth = useAuth()

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

      <div className={s.gridContainer}>
        <h1>More articles</h1>

      </div>
    </>
  )
})
