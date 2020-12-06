import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { observer } from 'mobx-react'
import { useAutorun } from '../../../hooks/useAutorun'
import { SectionModel } from '../../section/Section.model'
import { FormatService } from '../../shared/format/Format.service'
import { classnames } from '../../../services/importHelpers'
import { ImageContentModel } from './ImageContent.model'
import s from './ImageContent.module.scss'
import { ImageService } from './Image.service'
import { GridPositionService } from '../../grid/GridPosition.service'

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
  style?: CSSProperties
}

export const ImageContent = observer((props: Props) => {
  const { content, section, first = false, style } = props
  const ref = useRef<HTMLElement>()
  const [figureFormatStyle, setFigureFormatStyle] = useState<CSSProperties>({})
  const [imageFormatStyle, setImageFormatStyle] = useState<CSSProperties>({})
  const [loadImage, setLoadImage] = useState<boolean>(false)
  const [gridStyle, setGridStyle] = useState<CSSProperties>({})

  useAutorun(() => {
    const height = FormatService.imageHeight(section, content)
    const width = FormatService.imageWidth(content)
    setImageFormatStyle({
      height,
      width,
    })
  }, [content, section])

  useAutorun(() => {
    const { format } = content
    setFigureFormatStyle({
      backgroundColor: format.backgroundColor,
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

  const shouldLoadImage = useCallback(() => {
    if (
      !loadImage &&
      scrollY + window.innerHeight * 1.5 > ref.current.offsetTop
    ) {
      setLoadImage(true)
    }
  }, [loadImage])

  useEffect(() => {
    shouldLoadImage()
    window.addEventListener('scroll', shouldLoadImage)
    return () => window.removeEventListener('scroll', shouldLoadImage)
  })

  return (
    <figure
      ref={ref}
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
        ...style,
        ...gridStyle,
        ...figureFormatStyle,
      }}
    >
      {loadImage && (
        <img
          srcSet={ImageService.srcSet(content)}
          alt={content.set.alt}
          style={{
            ...imageFormatStyle,
          }}
          className={classnames(s.content, {
            [s.circle]: content.format.circle,
          })}
        />
      )}
    </figure>
  )
})
