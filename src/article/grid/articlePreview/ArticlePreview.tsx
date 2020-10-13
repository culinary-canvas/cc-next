import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Tags } from '../../../tag/Tags/Tags'
import s from './ArticlePreview.module.scss'
import { Button } from '../../../form/button/Button'
import { ArticleModel } from '../../Article.model'
import { ContentType } from '../../content/ContentType'
import { classnames } from '../../../services/importHelpers'
import { ImageContentModel } from '../../content/image/ImageContent.model'
import { TextContentModel } from '../../content/text/TextContent.model'
import StringUtils from '../../../services/utils/StringUtils'
import { dateTimeService } from '../../../services/dateTime/DateTime.service'
import { ImageService } from '../../content/image/Image.service'

interface Props {
  article: ArticleModel
}

export const ArticlePreview = observer((props: Props) => {
  const { article } = props
  const ref = useRef<HTMLElement>()
  const [imageContent, setImageContent] = useState<ImageContentModel>()
  const [subHeadingContent, setSubHeadingContent] = useState<TextContentModel>()
  const [loadImage, setLoadImage] = useState<boolean>(false)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const shouldLoadImage = useCallback(() => {
    if (!loadImage && scrollY + window.innerHeight > ref.current.offsetTop) {
      setLoadImage(true)
    }
  }, [loadImage])

  useEffect(() => {
    shouldLoadImage()
    window.addEventListener('scroll', shouldLoadImage)
    return () => window.removeEventListener('scroll', shouldLoadImage)
  })

  useEffect(() => {
    const image = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.IMAGE,
    ) as ImageContentModel

    const subHeading = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as TextContentModel

    setImageContent(image)
    setSubHeadingContent(subHeading)
  }, [article.sortedContents, article.sortedSections])

  return (
    <article
      className={classnames(s.article, {
        [s.promoted]: article.promoted,
      })}
    >
      <section className={s.image} ref={ref}>
        {!!imageContent && loadImage && (
          <img
            alt={imageContent.alt}
            className={classnames(s[`content-type-${imageContent.type}`], {
              [s.hide]: !imageLoaded,
            })}
            srcSet={ImageService.srcSet(imageContent)}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {!imageLoaded && <figure className={s.imageSkeleton} />}
      </section>

      <section className={s.articleType}>
        <Button
          onClick={(e) => {
            e.preventDefault()
            // env.articleStore.setTypeFilter(article.type)
          }}
        >
          {StringUtils.toDisplayText(article.type)}
        </Button>
      </section>

      <section className={s.title}>
        <h2>{article.title}</h2>
      </section>

      <section className={s.subHeading}>
        {!!subHeadingContent && <h3> {subHeadingContent.value} </h3>}
      </section>

      <section className={s.meta}>
        <span className={s.created}>
          {dateTimeService.calendar(article.created)}
        </span>
        <Tags selected={article.tagNames} />
      </section>
    </article>
  )
})
