import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useAutorun } from '../../../hooks/useAutorun'
import { SectionModel } from '../../models/Section.model'
import { classnames, isNil } from '../../../services/importHelpers'
import { ImageContentModel } from '../../models/ImageContent.model'
import s from './ImageContent.module.scss'
import { GridPositionService } from '../../grid/GridPosition.service'
import { Size } from '../../models/Size'
import { isMobile } from 'react-device-detect'
import { Image } from '../../../shared/image/Image'

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
  const [size, setSize] = useState<number>()

  useEffect(() => {
    if (isMobile) {
      setSize(100)
    } else {
      setSize(1)
    }
  }, [])

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

  return (
    <Image
      imageSet={content.set}
      initialSizeVw={size}
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
  )
})
