import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { animated, useSpring } from 'react-spring'

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
  const [isHovered, setHovered] = useState<boolean>(false)
  const [textContentHeight, setTextContentHeight] = useState<number>(0)

  const { height } = useSpring({
    height: isHovered ? `${textContentHeight}px` : '0px',
    config: { mass: 2, tension: 350, friction: 40 },
  })
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setTextContentHeight(node.scrollHeight)
    }
  }, [])

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
    <article
      className={classnames(s.article, className)}
      onMouseOver={() => setHovered(true)}
      onTouchStart={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchEnd={() => setHovered(false)}
    >
      <section className={s.image} ref={ref}>
        {!!imageContent && (
          <Image
            priority={priority}
            alt={imageContent.set.alt}
            layout="fill"
            objectFit="cover"
            src={imageContent.set.cropped.url}
          />
        )}
      </section>

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

        <h2>{article.title}</h2>

        <animated.div
          style={{
            height,
            overflow: 'hidden',
          }}
          ref={measuredRef}
        >
          <p className={s.subHeading}>{subHeadingContent?.value}</p>
          {!!article.tagNames.length && (
            <TagsView tagNames={article.tagNames} containerClassName={s.tags} />
          )}
        </animated.div>
      </section>
    </article>
  )
})
