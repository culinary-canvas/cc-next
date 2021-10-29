import React, { CSSProperties, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useAutorun } from '../../../hooks/useAutorun'
import { SectionModel } from '../../models/Section.model'
import { classnames, isNil } from '../../../services/importHelpers'
import { ImageContentModel } from '../../models/ImageContent.model'
import s from './ImageContent.module.scss'
import { GridPositionService } from '../../grid/GridPosition.service'
import { Size } from '../../models/Size'
import { Image } from '../../../shared/image/Image'
import { BREAKPOINT } from '../../../styles/layout'

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
  index: number
  style?: CSSProperties
}

export const ImageContent = observer((props: Props) => {
  const { content, section, first = false, index } = props
  const [figureFormatStyle, setFigureFormatStyle] = useState<CSSProperties>({})
  const [gridStyle, setGridStyle] = useState<CSSProperties>({})

  const calculatedSizes = useMemo<string>(() => {
    if (
      !section.format.gridPosition?.startColumn ||
      !content.format.gridPosition?.startColumn
    ) {
      return '100vw'
    }
    const sectionStartColumn = section.format.gridPosition.startColumn
    const sectionEndColumn = section.format.gridPosition.endColumn
    const startColumn = content.format.gridPosition.startColumn
    const endColumn = content.format.gridPosition.endColumn
    const gridColumns = endColumn - startColumn
    const columnVw = 25
    const columnWidth = 240
    const gapWidth = 32

    const mobile = first ? `100vw` : `calc(100vw - 2rem)`
    const desktop =
      sectionStartColumn === 1 && sectionEndColumn === 7
        ? `${columnVw * gridColumns}vw`
        : `${(columnWidth + gapWidth) * gridColumns}px`

    return `(max-width: ${BREAKPOINT.PHONE}px) ${mobile}, ${desktop}`
  }, [content, section])

  useAutorun(() => {
    const { format } = content
    setFigureFormatStyle({
      backgroundColor: format.backgroundColor,
      minHeight: !isNil(format.maxHeight) ? `${format.maxHeight}px` : undefined,
      maxHeight: !isNil(format.maxHeight) ? `${format.maxHeight}px` : undefined,
      height: `calc(100% - ${format.padding.top}px - ${format.padding.bottom}px)`,
      width: `calc(100% - ${format.padding.left}px - ${format.padding.right}px)`,
      marginTop: `${format.padding.top}px`,
      marginBottom: `${format.padding.bottom}px`,
      marginLeft: `${format.padding.left}px`,
      marginRight: `${format.padding.right}px`,
    })
  }, [content, content.format])

  useAutorun(() => {
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )
    setGridStyle(gridCss)
  }, [content, section, content.format])

  if (!content.set.image) {
    return null
  }

  return (
    <>
      <Image
        imageSet={content.set}
        sizes={calculatedSizes}
        figureClassName={classnames([
          s.container,
          s[`fit-${content.format.fit}`],
          {
            [s.first]: first,
          },
        ])}
        figureStyle={{
          ...gridStyle,
          ...figureFormatStyle,
        }}
        width={
          section.format.height === Size.FIT_CONTENT && content.set.image.width
        }
        height={
          section.format.height === Size.FIT_CONTENT && content.set.image.height
        }
        quality={60}
        // @ts-ignore
        layout={
          section.format.height === Size.FIT_CONTENT ? 'responsive' : 'fill'
        }
        priority={first}
        objectFit="cover"
        objectPosition="center"
        className={classnames(s.content, {
          [s.circle]: content.format.circle,
        })}
      />
    </>
  )
})
