import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react'
import { TextContentModel as TextContentModel } from './TextContent.model'
import { classnames } from '../../../services/importHelpers'
import { ContentType } from '../ContentType'
import s from './TextContent.module.scss'
import { useAutorun } from '../../../hooks/useAutorun'
import { GridPositionService } from '../../grid/GridPosition.service'
import ReactMarkdown from 'react-markdown'

interface Props {
  content: TextContentModel
  onClick?: () => any
  style?: CSSProperties
}

export const TextContent = observer((props: Props) => {
  const { content, style, onClick } = props
  const [formatStyle, setFormatStyle] = useState<CSSProperties>({})
  const [formatClassNames, setFormatClassNames] = useState<string>('')

  useAutorun(() => {
    const { format } = content
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )

    setFormatStyle({
      color: format.color,
      backgroundColor: format.backgroundColor,
      fontWeight: format.fontWeight,
      fontSize: `${format.fontSize}px`,
      fontFamily: content.format.fontFamily,
      paddingTop: `${format.padding.top}px`,
      paddingBottom: `${format.padding.bottom}px`,
      paddingLeft: `${format.padding.left}px`,
      paddingRight: `${format.padding.right}px`,
      ...gridCss,
    })
  }, [content.format])

  useAutorun(() => {
    setFormatClassNames(
      classnames([
        s.content,
        s[`horizontal-align-${content.format.horizontalAlign}`],
        s[`vertical-align-${content.format.verticalAlign}`],
        s[`content-type-${content.type}`],
        {
          [s.emphasize]: content.format.emphasize,
          [s.uppercase]: content.format.uppercase,
          [s.italic]: content.format.italic,
        },
      ]),
    )
  }, [content.type, content.format])

  return content.type === ContentType.TITLE ? (
    <h1
      className={formatClassNames}
      style={{ ...formatStyle, ...style }}
      onClick={() => !!onClick && onClick()}
    >
      {content.value}
    </h1>
  ) : (
    <div
      className={formatClassNames}
      style={{ ...formatStyle, ...style }}
      onClick={() => !!onClick && onClick()}
    >
      <ReactMarkdown
        renderers={{
          link: ({ node }) => (
            <a href={node.url} rel="noopener" target="_blank">
              {node.children[0].value}
            </a>
          ),
        }}
      >
        {content.value}
      </ReactMarkdown>
    </div>
  )
})
