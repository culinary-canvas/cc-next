import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useAdmin } from '../../../admin/Admin.context'
import { useAutorun } from '../../../hooks/useAutorun'
import { classnames } from '../../../services/importHelpers'
import { GridPositionService } from '../../grid/GridPosition.service'
import { TextContentModel } from '../../models/TextContent.model'
import { TextContentService } from '../../services/TextContent.service'
import s from './TextContentEdit.module.scss'
import { TextEditMenu } from './TextEditMenu'

interface Props {
  content: TextContentModel
}

export const TextContentEdit = observer((props: Props) => {
  const { content } = props
  const admin = useAdmin()
  const textareaRef = useRef<HTMLTextAreaElement>()

  const [style, setStyle] = useState<CSSProperties>({})
  const [gridWrapperStyle, setWrapperStyle] = useState<CSSProperties>({})
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  })

  useEffect(() => {
    if (!!textareaRef.current && admin.content.uid === content.uid) {
      if (
        textareaRef.current.getBoundingClientRect().top < 0 ||
        textareaRef.current.getBoundingClientRect().top > window.innerHeight
      ) {
        window.scrollBy({
          behavior: 'smooth',
          top: textareaRef.current.getBoundingClientRect().top - 64,
        })
      }
    }
  }, [admin.content, content, textareaRef])

  useAutorun(() => {
    const { format } = content
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )

    setWrapperStyle({
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
      ...gridCss,
    })

    setStyle({
      color: format.color,
      backgroundColor: format.backgroundColor,
      fontWeight: format.fontWeight,
      fontSize: TextContentService.getResponsiveFontSize(format.fontSize),
      fontFamily: content.format.fontFamily,
    })
  }, [content.format])

  return (
    <div
      className={classnames(
        s.wrapper,
        s[`horizontal-align-${content.format.horizontalAlign}`],
        s[`vertical-align-${content.format.verticalAlign}`],
      )}
      style={{ ...gridWrapperStyle }}
    >
      {!!(selection.end - selection.start) && (
        <TextEditMenu
          text={content.value}
          selectionStart={selection.start}
          selectionEnd={selection.end}
          onTextChange={(text) => runInAction(() => (content.value = text))}
        />
      )}
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
        onChange={(v) => runInAction(() => (content.value = v.target.value))}
        placeholder={content.placeholder}
        onBlur={(e) =>
          e.target.setSelectionRange(selection.start, selection.end)
        }
        onMouseUp={() =>
          setSelection({
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          })
        }
        onKeyUp={() =>
          setSelection({
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          })
        }
      />
    </div>
  )
})
