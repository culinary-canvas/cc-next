import React, { CSSProperties, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { ImageWithModal } from '../ImageWithModal/ImageWithModal'
import { useAutorun } from '../../hooks/useAutorun'
import { Section } from '../../domain/Section/Section'
import { useEnv } from '../../services/AppEnvironment'
import { FormatService } from '../../domain/Format/Format.service'
import { classnames } from '../../services/importHelpers'
import { ImageContent as _ImageContent } from '../../domain/Image/ImageContent'

interface Props {
  content: _ImageContent
  edit: boolean
  inheritedClassName: string
  style?: CSSProperties
  onFocus?: () => any
  section: Section
}

export const ImageContent = observer((props: Props) => {
  const env = useEnv()
  const { content, section, edit, inheritedClassName, style, onFocus } = props

  const imageRef = useRef<HTMLImageElement>()

  const [imageClassNames, setImageClassNames] = useState<string[]>([])
  const [imageStyle, setImageStyle] = useState<CSSProperties>({})
  const [inEdit, setInEdit] = useState<boolean>(false)

  useAutorun(() => {
    const { classNames: c, style: s } = FormatService.getApplicableImageFormat(
      content,
      section,
    )
    setImageClassNames(c)
    setImageStyle(s)
  }, [content])

  useAutorun(() => setInEdit(env.adminSidebarStore.isContentInEdit(content)))

  return (
    <figure
      className={classnames([
        'container',
        'image',
        `content-type-${content.type}`,
        imageClassNames,
        inheritedClassName,
        { 'in-edit': inEdit },
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
            ...imageStyle,
          }}
          className={classnames([
            'content',
            'image',
            `content-type-${content.type}`,
            imageClassNames,
            inheritedClassName,
            { 'in-edit': inEdit },
          ])}
          onFocus={() => onFocus()}
          enableModal={inEdit}
          onChange={(set) => (content.set = set)}
        />
      ) : (
        <img
          ref={imageRef}
          src={content.set.image.url}
          alt={content.set.alt}
          style={{
            ...imageStyle,
          }}
          className={classnames([
            'content',
            'image',
            `content-type-${content.type}`,
            imageClassNames,
            inheritedClassName,
          ])}
        />
      )}
    </figure>
  )
})
