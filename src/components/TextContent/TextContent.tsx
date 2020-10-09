import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import TextareaAutosize from 'react-textarea-autosize'
import { useAutorun } from '../../hooks/useAutorun'
import { TextContent as TextContentModel } from '../../domain/Text/TextContent'
import { TextContentService } from '../../domain/Text/TextContent.service'
import { classnames } from '../../services/importHelpers'
import { ContentType } from '../../domain/Text/ContentType'
import styles from './TextContent.module.scss'
import horizontalAlignStyles from './TextContent.horizontalAlign.module.scss'
import verticalAlignStyles from './TextContent.verticalAlign.module.scss'
import contentTypeStyles from './TextContent.contentType.module.scss'
import { useEnv } from '../../services/AppEnvironment'

interface Props {
  content: TextContentModel
  edit: boolean
  style?: CSSProperties
}

export const TextContent = observer((props: Props) => {
  const { content, edit = false, style } = props
  const env = useEnv()
  const textareaRef = useRef<HTMLTextAreaElement>()
  const [placeholder, setPlaceholder] = useState<string>()
  const [formatStyle, setFormatStyle] = useState<CSSProperties>({})

  useAutorun(() => {
    const { format } = content
    setFormatStyle({
      color: format.color,
      fontWeight: format.fontWeight,
      fontSize: `${format.fontSize}px`,
      fontFamily: format.fontFamily,
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
    })
  })

  useEffect(() => {
    setPlaceholder(TextContentService.placeholder(content.type))
  }, [content.type])

  return edit ? (
    <>
      <TextareaAutosize
        ref={textareaRef}
        className={classnames([
          styles.content,
          horizontalAlignStyles[
            `horizontal-align-${content.format.horizontalAlign}`
          ],
          verticalAlignStyles[`vertical-align-${content.format.verticalAlign}`],
          contentTypeStyles[`content-type-${content.type}`],
          {
            [styles.inEdit]: env.adminStore.content.uid === content.uid,
            [styles.emphasize]: content.format.emphasize,
            [styles.uppercase]: content.format.uppercase,
            [styles.italic]: content.format.italic,
          },
        ])}
        value={content.value}
        style={{ ...formatStyle, ...style } as any}
        onFocus={() => env.adminStore.setContent(content)}
        onChange={(v) => (content.value = v.target.value)}
        placeholder={placeholder}
      />
    </>
  ) : content.type === ContentType.TITLE ? (
    <h1
      className={classnames([
        styles.content,
        horizontalAlignStyles[
          `horizontal-align-${content.format.horizontalAlign}`
        ],
        verticalAlignStyles[`vertical-align-${content.format.verticalAlign}`],
        contentTypeStyles[`content-type-${content.type}`],
        {
          [styles.emphasize]: content.format.emphasize,
          [styles.uppercase]: content.format.uppercase,
          [styles.italic]: content.format.italic,
        },
      ])}
      style={{ ...formatStyle, ...style } as any}
    >
      {content.value}
    </h1>
  ) : (
    <p
      className={classnames([
        styles.content,
        horizontalAlignStyles[
          `horizontal-align-${content.format.horizontalAlign}`
        ],
        verticalAlignStyles[`vertical-align-${content.format.verticalAlign}`],
        contentTypeStyles[`content-type-${content.type}`],
        {
          [styles.emphasize]: content.format.emphasize,
          [styles.uppercase]: content.format.uppercase,
          [styles.italic]: content.format.italic,
        },
      ])}
      style={{ ...formatStyle, ...style } as any}
    >
      {content.value}
    </p>
  )
})
