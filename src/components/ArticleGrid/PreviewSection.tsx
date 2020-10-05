import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { ImageContent as _ImageContent } from '../../domain/Image/ImageContent'
import { ImageContent } from '../Section/ImageContent'
import { TextContent as _TextContent } from '../../domain/Text/TextContent'
import { Article } from '../../domain/Article/Article'
import { ContentType } from '../../domain/Text/ContentType'
import { TextContent } from '../Section/TextContent'
import {classnames} from '../../services/importHelpers'

interface Props {
  article: Article
}

export const PreviewSection = observer((props: Props) => {
  const { article } = props
  const [imageContent, setImageContent] = useState<_ImageContent>()
  const [titleContent, setTitleContent] = useState<_TextContent>()
  const [subHeadingContent, setSubHeadingContent] = useState<_TextContent>()

  useEffect(() => {
    const image = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.IMAGE,
    ) as _ImageContent
    const title = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.TITLE,
    ) as _TextContent
    const subHeading = article.sortedSections[0].sortedContents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as _TextContent
    setImageContent(image)
    setTitleContent(title)
    setSubHeadingContent(subHeading)
  }, [article.sortedSections])

  return (
    <section
      className={classnames('section', {
        background: imageContent?.format.background,
      })}
    >
      {!!imageContent && (
        <ImageContent
          content={imageContent}
          section={article.sortedSections[0]}
          edit={false}
          inheritedClassName={classnames({
            background: imageContent.format.background,
          })}
        />
      )}
      {!!titleContent && <TextContent content={titleContent} edit={false} />}
      {!!subHeadingContent && (
        <TextContent content={subHeadingContent} edit={false} />
      )}
    </section>
  )
})
