import React, { CSSProperties, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { ImageWithModal } from '../ImageWithModal/ImageWithModal'
import { useAutorun } from '../../hooks/useAutorun'
import { Section } from '../../domain/Section/Section'
import { FormatService } from '../../domain/Format/Format.service'
import { classnames } from '../../services/importHelpers'
import { ImageContent as _ImageContent } from '../../domain/Image/ImageContent'
import styles from './ImageContent.module.scss'
import horizontalAlignStyles from './ImageContent.horizontalAlign.module.scss'
import verticalAlignStyles from './ImageContent.verticalAlign.module.scss'
import { useAdmin } from '../../services/admin/Admin.store'

interface Props {
  content: _ImageContent
  section: Section
  edit: boolean
  first: boolean
  style?: CSSProperties
}

export const ImageContent = observer((props: Props) => {
  const { content, section, edit = false, first = false, style } = props
  const admin = useAdmin()
  const imageRef = useRef<HTMLImageElement>()
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
        styles.container,
        horizontalAlignStyles[
          `horizontal-align-${content.format.horizontalAlign}`
        ],
        verticalAlignStyles[`vertical-align-${content.format.verticalAlign}`],
        {
          [styles.inEdit]: edit && admin.content.uid === content.uid,
          [styles.background]: content.format.background,
          [styles.first]: first,
        },
      ])}
      style={{
        ...style,
      }}
    >
      {edit ? (
        <ImageWithModal
          ref={imageRef}
          set={content.set}
          style={{
            ...formatStyle,
          }}
          className={classnames([styles.content])}
          onFocus={() => admin.setContent(content)}
          enableModal={admin.content.uid === content.uid}
          onChange={(set) => (content.set = set)}
        />
      ) : (
        <img
          ref={imageRef}
          src={content.set.image.url}
          srcSet={`${content.set.m.url} 688w,
                  ${content.set.l.url}: 992w,
                  ${content.set.xl.url}: 1312w,
                  ${content.set.cropped.url}: 2048w`}
          alt={content.set.alt}
          style={{
            ...formatStyle,
          }}
          className={classnames([styles.content])}
        />
      )}
    </figure>
  )
})
