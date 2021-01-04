import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react'
import s from './ImageContentEdit.module.scss'
import { ImageContentModel } from '../../../../../article/content/image/ImageContent.model'
import { SectionModel } from '../../../../../article/section/Section.model'
import { useAdmin } from '../../../../Admin'
import { useAutorun } from '../../../../../hooks/useAutorun'
import { classnames } from '../../../../../services/importHelpers'
import { ImageEdit } from '../../../../../form/imageEdit/ImageEdit'
import { GridPositionService } from '../../../../../article/grid/GridPosition.service'
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
      height: `calc(100% - ${format.padding.top}px - ${format.padding.bottom}px)`,
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
    <figure
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
    </figure>
  )
})
