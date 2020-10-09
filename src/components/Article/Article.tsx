import React from 'react'
import { observer } from 'mobx-react'
import { Share } from '../Share/Share'
import { Button } from '../Button/Button'
import { useRouter } from 'next/router'
import { Article as ArticleModel } from '../../domain/Article/Article'
import { dateTimeService } from '../../domain/DateTime/DateTime.service'
import { Section } from '../Section/Section'
import { useAuth } from '../../services/auth/Auth'
import s from './Article.module.scss'
import { toJS } from 'mobx'
import { Tags } from '../Tags/Tags'
import {COLOR} from '../../styles/color'

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
        {article.sortedSections.map((section, i) => (
          <Section first={i === 0} key={section.uid} section={section} />
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

          <Share article={article} containerClassName={s.share}/>
        </footer>
      </article>
    </>
  )
})
