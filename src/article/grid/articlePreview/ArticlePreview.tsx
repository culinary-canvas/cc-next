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

interface Props {
  article: ArticleModel
  priority: boolean
  className?: string
}

export const ArticlePreview = observer((props: Props) => {
  const { article, priority, className } = props
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

  const [h, toggleH] = useState<boolean>(false)
  const variants = useRef({
    hovered: { height: 'auto' },
    blurred: { height: 0 },
  }).current

  return (
    <motion.article
      className={classnames(s.article, className)}
      onHoverStart={() => toggleH(true)}
      onHoverEnd={() => toggleH(false)}
      whileTap={{ scale: tagsHovered ? 1 : 0.95 }}
      animate={h ? 'hovered' : 'blurred'}
      variants={{
        hovered: {
          boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)',
        },
        blurred: {},
      }}
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

        <motion.div className={s.moreText} variants={variants}>
          <p className={s.subHeading}>{subHeadingContent?.value}</p>
          {!!article.tagNames.length && (
            <TagsView
              tagNames={article.tagNames}
              containerClassName={s.tags}
              onHover={() => setTagsHovered(true)}
              onBlur={() => setTagsHovered(false)}
            />
          )}
        </motion.div>
      </motion.section>
    </motion.article>
  )
})
