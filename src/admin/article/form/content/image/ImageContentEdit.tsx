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

interface Props {
  content: ImageContentModel
  section: SectionModel
  first: boolean
  style?: CSSProperties
}

export const ImageContentEdit = observer((props: Props) => {
  const { content, section, first = false, style } = props
  const admin = useAdmin()
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
          [s.inEdit]: admin.content.uid === content.uid,
          [s.background]: content.format.background,
          [s.first]: first,
        },
      ])}
      style={{
        ...style,
      }}
    >
      <ImageEdit
        set={content.set}
        style={{
          ...formatStyle,
        }}
        className={classnames([s.content])}
        onFocus={() => admin.setContent(content)}
        enableModal={admin.content.uid === content.uid}
        onChange={(set) => (content.set = set)}
      />
    </figure>
  )
})
