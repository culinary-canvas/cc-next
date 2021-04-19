import React, { CSSProperties, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useAutorun } from '../../../hooks/useAutorun'
import { SectionModel } from '../../models/Section.model'
import { classnames, isNil } from '../../../services/importHelpers'
import { ImageContentModel } from '../../models/ImageContent.model'
import s from './ImageContent.module.scss'
import { GridPositionService } from '../../grid/GridPosition.service'
import Image from 'next/image'
import { Size } from '../../models/Size'
import { motion } from 'framer-motion'

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
  const [size, setSize] = useState<string>()

  const calculateAndSetSizes = useCallback(() => {
    const contentColumns =
      content.format.gridPosition.endColumn -
      content.format.gridPosition.startColumn
    const relativeContentWidth = contentColumns / 4

    const sectionColumns =
      section.format.gridPosition.endColumn -
      section.format.gridPosition.startColumn
    const relativeSectionWidth = sectionColumns / 6

    const relativeWidth = relativeSectionWidth * relativeContentWidth * 100

    setSize(`${relativeWidth}vw`)
  }, [section, content])

  useAutorun(() => {
    const { format } = content
    calculateAndSetSizes()
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
  }, [content, content.format, calculateAndSetSizes])

  useAutorun(() => {
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )
    setGridStyle(gridCss)
  }, [content, section, content.format])

  return (
    <motion.figure
      className={classnames([
        s.container,
        s[`fit-${content.format.fit}`],
        {
          [s.first]: first,
        },
      ])}
      style={{
        ...gridStyle,
        ...figureFormatStyle,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.5 }}
    >
      <Image
        sizes={size}
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
        quality={75}
        objectFit="cover"
        objectPosition="center"
        priority={first}
        alt={content.set.alt}
        src={content.set.image.url}
        className={classnames(s.content, {
          [s.circle]: content.format.circle,
        })}
      />
    </motion.figure>
  )
})
