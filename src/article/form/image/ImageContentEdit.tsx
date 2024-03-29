import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react-lite'
import s from './ImageContentEdit.module.scss'
import { ImageContentModel } from '../../models/ImageContent.model'
import { SectionModel } from '../../models/Section.model'
import { useAdmin } from '../../../admin/Admin.context'
import { useAutorun } from '../../../hooks/useAutorun'
import { classnames, isNil } from '../../../services/importHelpers'
import { ImageEdit } from '../../../image/imageEdit/ImageEdit'
import { GridPositionService } from '../../grid/GridPosition.service'
import { runInAction } from 'mobx'

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
}

export const ImageContentEdit = observer((props: Props) => {
  const { content, section, first = false } = props
  const admin = useAdmin()

  const [figureFormatStyle, setFigureFormatStyle] = useState<CSSProperties>({})
  const [gridStyle, setGridStyle] = useState<CSSProperties>({})

  useAutorun(() => {
    const { format } = content

    setFigureFormatStyle({
      backgroundColor: format.backgroundColor,
      minHeight: !isNil(format.maxHeight) ? `${format.maxHeight}px` : undefined,
      maxHeight: !isNil(format.maxHeight) ? `${format.maxHeight}px` : undefined,
      height: `calc(${
        !isNil(format.maxHeight) ? `${format.maxHeight}px` : '100%'
      } - ${format.padding.top}px - ${format.padding.bottom}px)`,
      marginTop: `${format.padding.top}px`,
      marginBottom: `${format.padding.bottom}px`,
      marginLeft: `${format.padding.left}px`,
      marginRight: `${format.padding.right}px`,
    })
  }, [content, section, content.format])

  useAutorun(() => {
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )
    setGridStyle(gridCss)
  }, [content, section, content.format])

  return (
    <div
      className={classnames([
        s.container,
        s[`fit-${content.format.fit}`],
        {
          [s.inEdit]: admin.content?.uid === content.uid,
          [s.first]: first,
        },
      ])}
      style={{
        ...gridStyle,
        ...figureFormatStyle,
      }}
    >
      <ImageEdit
        set={content.set}
        format={content.format}
        className={classnames([
          s.content,
          { [s.circle]: content.format.circle },
        ])}
        onFocus={() => admin.setContent(content)}
        enableModal={admin.content?.uid === content.uid}
        onChange={(set) => runInAction(() => (content.set = set))}
      />
    </div>
  )
})
