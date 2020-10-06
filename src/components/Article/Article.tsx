import React, { CSSProperties } from 'react'
import { observer } from 'mobx-react'
import { Share } from '../Share/Share'
import { Button } from '../Button/Button'
import { useRouter } from 'next/router'
import { classnames } from '../../services/importHelpers'
import { Article as ArticleModel } from '../../domain/Article/Article'
import { dateTimeService } from '../../domain/DateTime/DateTime.service'
import { Section } from '../Section/Section'
import {useAuth} from '../../services/auth/Auth'

interface Props {
  article: ArticleModel
  preview?: boolean
  containerClassName?: string
  inheritedClassName?: string
  style?: CSSProperties
}

export const Article = observer((props: Props) => {
  const {
    article,
    preview = false,
    containerClassName = '',
    inheritedClassName = '',
    style,
  } = props

  const router = useRouter()
  const auth = useAuth()

  return (
    <>
      {auth.isSignedIn && (
        <Button
          className="edit-button"
          onClick={
            () =>
              // TODO nav
              null
            /*router.navigate({
              url: `/admin/articles/${article.titleForUrl}`,
            })*/
          }
        >
          Edit
        </Button>
      )}
      <article
        className={classnames([
          'content',
          'article',
          containerClassName,
          inheritedClassName,
          { preview },
        ])}
        style={{ ...style }}
      >
        {article.sortedSections.map(
          (section, i) =>
            (!preview ||
              (article.promoted && i <= 1) ||
              (!article.promoted && i === 0)) && (
              <Section
                first={i === 0}
                key={section.uid}
                section={section}
                inheritedClassName={classnames([
                  inheritedClassName,
                  { preview },
                ])}
              />
            ),
        )}
        {!preview && (
          <footer className={classnames(['footer', { preview }])}>
            <section className="meta">
              Published {dateTimeService.calendar(article.created.date)}
            </section>
            <Share article={article} />
          </footer>
        )}
      </article>
    </>
  )
})
