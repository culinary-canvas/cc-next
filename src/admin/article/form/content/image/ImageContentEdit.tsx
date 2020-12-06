import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react'
import s from './ImageContentEdit.module.scss'
import { ImageContentModel } from '../../../../../article/content/image/ImageContent.model'
import { SectionModel } from '../../../../../article/section/Section.model'
import { useAdmin } from '../../../../Admin'
import { useAutorun } from '../../../../../hooks/useAutorun'
import { FormatService } from '../../../../../article/shared/format/Format.service'
import { classnames } from '../../../../../services/importHelpers'
import { ImageEdit } from '../../../../../form/imageEdit/ImageEdit'
import { GridPositionService } from '../../../../../article/grid/GridPosition.service'

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
}

export const ImageContentEdit = observer((props: Props) => {
  const { content, section, first = false } = props
  const admin = useAdmin()

  const [figureFormatStyle, setFigureFormatStyle] = useState<CSSProperties>({})
  const [imageFormatStyle, setImageFormatStyle] = useState<CSSProperties>({})
  const [gridStyle, setGridStyle] = useState<CSSProperties>({})

  useAutorun(() => {
    const { format } = content
    const height = FormatService.imageHeight(section, content)
    const width = FormatService.imageWidth(content)

    setFigureFormatStyle({
      backgroundColor: format.backgroundColor,
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
    })

    setImageFormatStyle({
      height,
      width,
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
        s[`horizontal-align-${content.format.horizontalAlign}`],
        s[`vertical-align-${content.format.verticalAlign}`],
        s[`fit-${content.format.fit}`],
        {
          [s.inEdit]: admin.content.uid === content.uid,
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
        style={{
          ...imageFormatStyle,
        }}
        className={classnames([
          s.content,
          { [s.circle]: content.format.circle },
        ])}
        onFocus={() => admin.setContent(content)}
        enableModal={admin.content.uid === content.uid}
        onChange={(set) => (content.set = set)}
      />
    </figure>
  )
})
