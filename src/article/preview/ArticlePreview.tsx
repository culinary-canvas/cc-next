import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import s from './ArticlePreview.module.scss'
import { Button } from '../../shared/button/Button'
import { ArticleModel } from '../models/Article.model'
import { ContentType } from '../models/ContentType'
import { ImageContentModel } from '../models/ImageContent.model'
import { TextContentModel } from '../models/TextContent.model'
import StringUtils from '../../services/utils/StringUtils'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { classnames } from '../../services/importHelpers'
import { COLOR } from '../../styles/_color'
import ReactMarkdown from 'react-markdown'
import { ArticleLabel } from '../models/ArticleLabel'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from '../models/ImageFormat'

interface Props {
  article: ArticleModel
  priority?: boolean
  className?: string
  labels?: ArticleLabel[]
}

export const ArticlePreview = observer((props: Props) => {
  const { article, labels, priority = false, className } = props
  const router = useRouter()
  const ref = useRef<HTMLElement>()
  const [imageSet, setImageSet] = useState<ImageSet>()
  const [imageFormat, setImageFormat] = useState<ImageFormat>()
  const [title, setTitle] = useState<string>()
  const [subHeading, setSubHeading] = useState<string>()

  useEffect(() => {
    if (
      article.preview.useArticleImage ||
      !article.preview.image.original?.url
    ) {
      const imageContent = article.contents.find(
        (c) => c.type === ContentType.IMAGE,
      ) as ImageContentModel
      setImageSet(imageContent.set)
      setImageFormat(imageContent.format)
    } else {
      setImageSet(article.preview.image)
      setImageFormat(article.preview.imageFormat)
    }

    setTitle(
      article.preview.useArticleTitle ? article.title : article.preview.title,
    )
    setSubHeading(
      article.preview.useArticleText
        ? (article.contents.find(
            (c) => c.type === ContentType.SUB_HEADING,
          ) as TextContentModel)?.value
        : article.preview.text,
    )
  }, [
    article.contents,
    article.sections,
    article.preview.useArticleTitle,
    article.preview.title,
    article.preview.useArticleText,
    article.preview.text,
    article.preview.useArticleImage,
    article.preview.image,
  ])

  return (
    <article className={classnames(s.article, className)}>
      <figure className={s.image} ref={ref}>
        {!!imageSet && !!imageFormat && (
          <Image
            priority={priority}
            quality={40}
            alt={imageSet.alt}
            layout="fill"
            objectFit="cover"
            objectPosition={
              imageFormat.verticalAlign
                ? imageFormat.verticalAlign.toLowerCase()
                : 'center'
            }
            src={imageSet.url}
          />
        )}
      </figure>
      <section className={classnames(s.text, { [s.hasLabels]: !!labels })}>
        <Button
          className={s.articleType}
          unsetStyle
          onClick={(e) => {
            e.preventDefault()
            router.push(`/${StringUtils.toLowerKebabCase(article.type)}`)
          }}
        >
          {StringUtils.toDisplayText(article.type)}
        </Button>

        <h2 className={s.title}>{title}</h2>

        <ReactMarkdown
          className={s.subHeading}
          renderers={{
            link: ({ node }) => node.children[0].value,
          }}
        >
          {subHeading}
        </ReactMarkdown>

        {!!labels && (
          <div className={s.labels}>
            <span>In this article</span>
            {labels.map((l) => (
              <Button
                unsetStyle
                key={l.label}
                onClick={(e) => {
                  e.preventDefault()
                  router.push(l.path)
                }}
                color={COLOR.GREY_DARK}
              >
                {l.label}
              </Button>
            ))}
          </div>
        )}
      </section>
    </article>
  )
})
