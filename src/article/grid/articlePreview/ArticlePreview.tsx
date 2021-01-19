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
import { motion } from 'framer-motion'
import { COLOR } from '../../../styles/_color'
import ReactMarkdown from 'react-markdown'

export interface ArticleLabel {
  label: string
  path: string
}

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
  const [tagsHovered, setTagsHovered] = useState<boolean>(false)

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
    <motion.article
      className={classnames(s.article, className)}
      whileTap={{ scale: tagsHovered ? 1 : 0.95 }}
      layout
    >
      {!!imageContent && (
        <motion.figure className={s.image} ref={ref}>
          <Image
            priority={priority}
            alt={imageContent.set.alt}
            layout="fill"
            objectFit="cover"
            src={imageContent.set.cropped.url}
          />
        </motion.figure>
      )}

      <motion.section className={s.text}>
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

        <h2>{article.title}</h2>
        <div className={s.moreText}>
          <ReactMarkdown
            className={s.subHeading}
            renderers={{
              link: ({ node }) => node.children[0].value,
            }}
          >
            {subHeadingContent?.value}
          </ReactMarkdown>
          {!!article.tagNames.length && (
            <TagsView
              tagNames={article.tagNames}
              containerClassName={s.tags}
              onHover={() => setTagsHovered(true)}
              onBlur={() => setTagsHovered(false)}
            />
          )}
        </div>
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
      </motion.section>
    </motion.article>
  )
})
