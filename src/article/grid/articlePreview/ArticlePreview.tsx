import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { TagsView } from '../../../tag/Tags/TagsView'
import s from './ArticlePreview.module.scss'
import { Button } from '../../../form/button/Button'
import { ArticleModel } from '../../Article.model'
import { ContentType } from '../../content/ContentType'
import { ImageContentModel } from '../../content/image/ImageContent.model'
import { TextContentModel } from '../../content/text/TextContent.model'
import StringUtils from '../../../services/utils/StringUtils'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { classnames } from '../../../services/importHelpers'
import { COLOR } from '../../../styles/_color'
import ReactMarkdown from 'react-markdown'
import { ArticleLabel } from '../../ArticleLabel'

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
  const [imageContent, setImageContent] = useState<ImageContentModel>()
  const [subHeadingContent, setSubHeadingContent] = useState<TextContentModel>()

  useEffect(() => {
    const image = article.contents.find(
      (c) => c.type === ContentType.IMAGE,
    ) as ImageContentModel

    const subHeading = article.contents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as TextContentModel

    setImageContent(image)
    setSubHeadingContent(subHeading)
  }, [article.contents, article.sections])

  return (
    <article className={classnames(s.article, className)}>
      {!!imageContent && (
        <figure className={s.image} ref={ref}>
          <Image
            priority={priority}
            quality={60}
            alt={imageContent.set.alt}
            layout="fill"
            objectFit="cover"
            src={imageContent.set.cropped.url}
          />
        </figure>
      )}

      <section className={s.text}>
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

        <h2 className={s.title}>{article.title}</h2>

        <ReactMarkdown
          className={s.subHeading}
          renderers={{
            link: ({ node }) => node.children[0].value,
          }}
        >
          {subHeadingContent?.value}
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
