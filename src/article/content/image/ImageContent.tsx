import React, { CSSProperties, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { useAutorun } from '../../../hooks/useAutorun'
import { SectionModel } from '../../section/Section.model'
import { classnames } from '../../../services/importHelpers'
import { ImageContentModel } from './ImageContent.model'
import s from './ImageContent.module.scss'
import { GridPositionService } from '../../grid/GridPosition.service'
import Image from 'next/image'
import { Size } from '../../shared/format/Size'

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
}

export const ImageContent = observer((props: Props) => {
  const { content, section, first = false } = props
  const ref = useRef<HTMLElement>()
  const [figureFormatStyle, setFigureFormatStyle] = useState<CSSProperties>({})
  const [gridStyle, setGridStyle] = useState<CSSProperties>({})

  useAutorun(() => {
    const { format } = content
    setFigureFormatStyle({
      backgroundColor: format.backgroundColor,
      height: `calc(100% - ${format.padding.top}px - ${format.padding.bottom}px)`,
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
    })
  }, [content, content.format])

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
        s[`horizontal-align-${content.format.horizontalAlign}`],
        s[`vertical-align-${content.format.verticalAlign}`],
        s[`fit-${content.format.fit}`],
        {
          [s.first]: first,
        },
      ])}
      style={{
        ...gridStyle,
        ...figureFormatStyle,
      }}
    >
      <Image
        width={
          section.format.height === Size.FIT_CONTENT &&
          (content.format.fixedWidth || content.set.cropped.width)
        }
        height={
          section.format.height === Size.FIT_CONTENT &&
          (content.format.fixedHeight || content.set.cropped.height)
        }
        // @ts-ignore
        layout={
          section.format.height === Size.FULL_SCREEN ? 'fill' : 'responsive'
        }
        quality={75}
        objectFit="cover"
        objectPosition="center"
        priority={first}
        alt={content.set.alt}
        src={content.set.cropped.url}
        className={classnames(s.content, {
          [s.circle]: content.format.circle,
        })}
      />
    </div>
  )
})
