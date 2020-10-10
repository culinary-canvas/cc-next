import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Tags } from '../Tags/Tags'
import styles from './PreviewArticle.module.scss'
import { Button } from '../Button/Button'
import { Article } from '../../domain/Article/Article'
import { ContentType } from '../../domain/Text/ContentType'
import { classnames } from '../../services/importHelpers'
import { ImageContent as _ImageContent } from '../../domain/Image/ImageContent'
import { TextContent as _TextContent } from '../../domain/Text/TextContent'
import StringUtils from '../../services/utils/StringUtils'
import { dateTimeService } from '../../domain/DateTime/DateTime.service'

interface Props {
  article: Article
}

export const PreviewArticle = observer((props: Props) => {
  const { article } = props

  const [imageContent, setImageContent] = useState<_ImageContent>()
  const [subHeadingContent, setSubHeadingContent] = useState<_TextContent>()

  useEffect(() => {
    const image = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.IMAGE,
    ) as _ImageContent

    const subHeading = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as _TextContent

    setImageContent(image)
    setSubHeadingContent(subHeading)
  }, [article.sortedContents, article.sortedSections])

  return (
    <article
      className={classnames(styles.article, {
        [styles.promoted]: article.promoted,
      })}
    >
      <section className={styles.image}>
        {!!imageContent && (
          <img
            src={imageContent.url}
            alt={imageContent.alt}
            className={styles[`content-type-${imageContent.type}`]}
          />
        )}
      </section>

      <section className={styles.articleType}>
        <Button
          onClick={(e) => {
            e.preventDefault()
            // env.articleStore.setTypeFilter(article.type)
          }}
        >
          {StringUtils.toDisplayText(article.type)}
        </Button>
      </section>

      <section className={styles.title}>
        <h2>{article.title}</h2>
      </section>

      <section className={styles.subHeading}>
        {!!subHeadingContent && <h3> {subHeadingContent.value} </h3>}
      </section>

      <section className={styles.meta}>
        <span className={styles.created}>
          {dateTimeService.calendar(article.created)}
        </span>
        <Tags selected={article.tagNames} />
      </section>
    </article>
  )
})
