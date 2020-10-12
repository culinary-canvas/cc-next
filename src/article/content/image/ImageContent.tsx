import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react'
import { useAutorun } from '../../../hooks/useAutorun'
import { SectionModel } from '../../section/Section.model'
import { FormatService } from '../../shared/format/Format.service'
import { classnames } from '../../../services/importHelpers'
import { ImageContentModel } from './ImageContent.model'
import s from './ImageContent.module.scss'

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
  style?: CSSProperties
}

export const ImageContent = observer((props: Props) => {
  const { content, section, first = false, style } = props
  const [formatStyle, setFormatStyle] = useState<CSSProperties>({})

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

  return (
    <figure
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
      <img
        src={content.set.image.url}
        srcSet={`${content.set.m.url} 688w,
                  ${content.set.l.url}: 992w,
                  ${content.set.xl.url}: 1312w,
                  ${content.set.cropped.url}: 2048w`}
        alt={content.set.alt}
        style={{
          ...formatStyle,
        }}
        className={classnames([s.content])}
      />
    </figure>
  )
})
