import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import TextareaAutosize from 'react-textarea-autosize'
import { TextContentModel } from '../../../../../article/content/text/TextContent.model'
import { useAdmin } from '../../../../Admin'
import { useAutorun } from '../../../../../hooks/useAutorun'
import { classnames } from '../../../../../services/importHelpers'
import s from './TextContentEdit.module.scss'
import { GridPositionService } from '../../../../../article/grid/GridPosition.service'

interface Props {
  content: TextContentModel
}

export const TextContentEdit = observer((props: Props) => {
  const { content } = props
  const admin = useAdmin()
  const textareaRef = useRef<HTMLTextAreaElement>()

  const [style, setStyle] = useState<CSSProperties>({})

  useEffect(() => {
    if (!!textareaRef.current && admin.content.uid === content.uid) {
      textareaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [admin.content, content, textareaRef])

  useAutorun(() => {
    const { format } = content
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )

    setStyle({
      color: format.color,
      backgroundColor: format.backgroundColor,
      fontWeight: format.fontWeight,
      fontSize: `${format.fontSize}px`,
      fontFamily: content.format.fontFamily,
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
      ...gridCss,
    })
  }, [content.format])

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
      style={{ ...style } as any}
      onFocus={() => admin.setContent(content)}
      onChange={(v) => (content.value = v.target.value)}
      placeholder={content.placeholder}
    />
  )
})
