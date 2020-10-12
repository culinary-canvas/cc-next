import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import TextareaAutosize from 'react-textarea-autosize'
import { TextContentModel } from '../../../../../article/content/text/TextContent.model'
import { useAdmin } from '../../../../Admin'
import { useAutorun } from '../../../../../hooks/useAutorun'
import { TextContentService } from '../../../../../article/content/text/TextContent.service'
import { classnames } from '../../../../../services/importHelpers'
import s from './TextContentEdit.module.scss'

interface Props {
  content: TextContentModel
  style?: CSSProperties
}

export const TextContentEdit = observer((props: Props) => {
  const { content, style } = props
  const admin = useAdmin()
  const textareaRef = useRef<HTMLTextAreaElement>()
  const [placeholder, setPlaceholder] = useState<string>()
  const [formatStyle, setFormatStyle] = useState<CSSProperties>({})

  useAutorun(() => {
    const { format } = content

    setFormatStyle({
      color: format.color,
      fontWeight: format.fontWeight,
      fontSize: `${format.fontSize}px`,
      fontFamily: content.format.fontFamily,
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
    })
  }, [content.format])

  useEffect(() => {
    setPlaceholder(TextContentService.placeholder(content.type))
  }, [content.type])

  return (
    <TextareaAutosize
      ref={textareaRef}
      className={classnames([
        s.content,
        s[`horizontal-align-${content.format.horizontalAlign}`],
        s[`vertical-align-${content.format.verticalAlign}`],
        s[`content-type-${content.type}`],
        {
          [s.inEdit]: admin.content.uid === content.uid,
          [s.emphasize]: content.format.emphasize,
          [s.uppercase]: content.format.uppercase,
          [s.italic]: content.format.italic,
        },
      ])}
      value={content.value}
      style={{ ...formatStyle, ...style } as any}
      onFocus={() => admin.setContent(content)}
      onChange={(v) => (content.value = v.target.value)}
      placeholder={placeholder}
    />
  )
})
