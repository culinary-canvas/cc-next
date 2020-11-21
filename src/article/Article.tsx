import React from 'react'
import { observer } from 'mobx-react'
import { Share } from './shared/share/Share'
import { Button } from '../form/button/Button'
import { useRouter } from 'next/router'
import { ArticleModel } from './Article.model'
import { dateTimeService } from '../services/dateTime/DateTime.service'
import { useAuth } from '../services/auth/Auth'
import s from './Article.module.scss'
import { Tags } from '../tag/Tags/Tags'
import { COLOR } from '../styles/color'
import { SectionModel } from './section/Section.model'
import { Section } from './section/Section'

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
      <article className={s.content}>
        {article.sections.map((section) => (
          <Section
            first={section.format.gridPosition.startRow === 1}
            key={section.uid}
            section={section}
          />
        ))}
        <footer className={s.footer}>
          <section className={s.published}>
            Published {dateTimeService.calendar(article.created.date)}
          </section>

          <Tags
            selected={article.tagNames}
            containerClassName={s.tags}
            backgroundColor={COLOR.WHITE}
          />

          <Share article={article} containerClassName={s.share} />
        </footer>
      </article>
    </>
  )
})
