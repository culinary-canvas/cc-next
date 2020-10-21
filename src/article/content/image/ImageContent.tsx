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

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
  style?: CSSProperties
}

export const ImageContent = observer((props: Props) => {
  const { content, section, first = false, style } = props
  const ref = useRef<HTMLElement>()
  const [formatStyle, setFormatStyle] = useState<CSSProperties>({})
  const [loadImage, setLoadImage] = useState<boolean>(false)

  useAutorun(() => {
    const { format } = content
    const height = FormatService.imageHeight(section, content)
    const width = FormatService.imageWidth(content)
    setFormatStyle({
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
      height,
      width,
    })
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
        {
          [s.background]: content.format.background,
          [s.first]: first,
        },
      ])}
      style={{
        ...style,
      }}
    >
      {loadImage && (
        <img
          srcSet={ImageService.srcSet(content)}
          alt={content.set.alt}
          style={{
            ...formatStyle,
          }}
          className={classnames([s.content])}
        />
      )}
    </figure>
  )
})
