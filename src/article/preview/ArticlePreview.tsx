import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ImageSet } from '../../image/models/ImageSet'
import { IssueService } from '../../issue/Issue.service'
import { classnames } from '../../services/importHelpers'
import StringUtils from '../../services/utils/StringUtils'
import { Button } from '../../shared/button/Button'
import { Image } from '../../shared/image/Image'
import { COLOR } from '../../styles/_color'
import { BREAKPOINT, CONTAINER_MAX_WIDTHS } from '../../styles/layout'
import { ArticleModel } from '../models/Article.model'
import { ArticleLabel } from '../models/ArticleLabel'
import { ContentType } from '../models/ContentType'
import { ImageContentModel } from '../models/ImageContent.model'
import { ImageFormat } from '../models/ImageFormat'
import { TextContentModel } from '../models/TextContent.model'
import s from './ArticlePreview.module.scss'

interface Props {
  article: ArticleModel
  first?: boolean
  className?: string
  labels?: ArticleLabel[]
  preloadImage?: boolean
}

export const ArticlePreview = observer((props: Props) => {
  const {
    article,
    labels,
    first = false,
    className,
    preloadImage = false,
  } = props
  const router = useRouter()
  const [imageSet, setImageSet] = useState<ImageSet>()
  const [imageFormat, setImageFormat] = useState<ImageFormat>()
  const [title, setTitle] = useState<string>()
  const [subHeading, setSubHeading] = useState<string>()

  const calculateSize = useCallback((containerMaxWidth: number) => {
    return Math.round(first ? containerMaxWidth : containerMaxWidth * 0.33)
  }, [])

  const calculatedSizes = useMemo<string>(() => {
    const mobile = `(max-width: ${BREAKPOINT.PHONE}px) calc(100vw - 2rem)`
    const tablet = `(max-width: ${BREAKPOINT.TABLET}px) ${calculateSize(
      CONTAINER_MAX_WIDTHS.TABLET,
    )}px`
    const desktopS = `(max-width: ${BREAKPOINT.DESKTOP_S}px) ${calculateSize(
      CONTAINER_MAX_WIDTHS.DESKTOP_S,
    )}px`
    const desktopL = `(max-width: ${BREAKPOINT.DESKTOP_L}px) ${calculateSize(
      CONTAINER_MAX_WIDTHS.DESKTOP_L,
    )}px`
    const desktopXL = `${calculateSize(
      CONTAINER_MAX_WIDTHS.DESKTOP_L_EXCESS,
    )}px`
    return `${mobile}, ${tablet}, ${desktopS}, ${desktopL}, ${desktopXL}`
  }, [first, article.promoted])

  useEffect(() => {
    if (
      article.preview.useArticleImage ||
      !article.preview.imageSet?.original?.url
    ) {
      const imageContent = article.contents.find(
        (c) => c.type === ContentType.IMAGE,
      ) as ImageContentModel
      setImageSet(imageContent.set)
      setImageFormat(imageContent.format)
    } else {
      setImageSet(article.preview.imageSet)
      setImageFormat(article.preview.imageFormat)
    }

    setTitle(
      article.preview.useArticleTitle ? article.title : article.preview.title,
    )
    setSubHeading(
      article.preview.useArticleText
        ? (
            article.contents.find(
              (c) => c.type === ContentType.SUB_HEADING,
            ) as TextContentModel
          )?.value
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
    article.preview.imageSet,
  ])

  return (
    <article
      className={classnames(
        s.article,
        className,
        article.sponsored && s.sponsored,
        first && s.first,
      )}
    >
      {!!article.sponsored && (
        <div className={s.sponsoredTag}>Sponsored content</div>
      )}
      <Image
        sizes={calculatedSizes}
        priority={preloadImage}
        imageSet={imageSet}
        layout="fill"
        objectFit="cover"
        objectPosition={
          imageFormat?.verticalAlign
            ? imageFormat.verticalAlign.toLowerCase()
            : 'center'
        }
        figureClassName={s.figure}
        quality={60}
      />

      <section className={classnames(s.text, { [s.hasLabels]: !!labels })}>
        {!!article.issueId ? (
          <Button
            className={s.articleType}
            unsetStyle
            onClick={(e) => {
              e.preventDefault()
              router.push(`/${StringUtils.toLowerKebabCase(article.type)}`)
            }}
          >
            {IssueService.toDisplayText(article.issue)}
          </Button>
        ) : (
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
        )}

        <h2 className={s.title}>{title}</h2>

        <ReactMarkdown
          className={s.subHeading}
          disallowedElements={['a']}
          unwrapDisallowed={true}
          components={{
            // @ts-ignore
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
