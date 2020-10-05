import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import TextareaAutosize from 'react-textarea-autosize'
import { useAutorun } from '../../hooks/useAutorun'
import { TextContent as TextContentModel } from '../../domain/Text/TextContent'
import { useEnv } from '../../services/AppEnvironment'
import { FormatService } from '../../domain/Format/Format.service'
import { TextContentService } from '../../domain/Text/TextContent.service'
import { classnames } from '../../services/importHelpers'
import { ContentType } from '../../domain/Text/ContentType'

interface Props {
  content: TextContentModel
  edit: boolean
  inheritedClassName?: string
  style?: CSSProperties
}

export const TextContent = observer((props: Props) => {
  const env = useEnv()
  const { content, edit, inheritedClassName, style } = props

  const textareaRef = useRef<HTMLTextAreaElement>()

  const [placeholder, setPlaceholder] = useState<string>()

  const [textClassNames, setTextClassNames] = useState<string[]>([])
  const [textStyle, setTextStyle] = useState<CSSProperties>({})
  const [inEdit, setInEdit] = useState<boolean>(false)

  useAutorun(() => {
    const { classNames: c, style: s } = FormatService.getApplicableTextFormat(
      content,
    )
    setTextClassNames(c)
    setTextStyle(s)
  }, [content])

  useAutorun(() => setInEdit(env.adminSidebarStore.isContentInEdit(content)))

  useEffect(() => {
    setPlaceholder(TextContentService.placeholder(content.type))
  }, [content.type])

  return edit ? (
    <>
      <TextareaAutosize
        ref={textareaRef}
        className={classnames([
          'content',
          'text',
          'textarea',
          `content-type-${content.type}`,
          textClassNames,
          inheritedClassName,
          { 'in-edit': inEdit },
        ])}
        value={content.value}
        style={{ ...textStyle, ...style } as any}
        onFocus={() => env.adminSidebarStore.setContent(content)}
        onChange={(v) => (content.value = v.target.value)}
        placeholder={placeholder}
      />
    </>
  ) : content.type === ContentType.TITLE ? (
    <h1
      className={classnames([
        'content',
        'text',
        'textarea',
        `content-type-${content.type}`,
        textClassNames,
        inheritedClassName,
      ])}
      style={{ ...textStyle, ...style } as any}
    >
      {content.value}
    </h1>
  ) : (
    <p
      className={classnames([
        'content',
        'text',
        'textarea',
        `content-type-${content.type}`,
        textClassNames,
        inheritedClassName,
      ])}
      style={{ ...textStyle, ...style } as any}
    >
      {content.value}
    </p>
  )
})
