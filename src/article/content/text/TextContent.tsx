import classNames from 'classnames'
import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAutorun } from '../../../hooks/useAutorun'
import { classnames } from '../../../services/importHelpers'
import { GridPositionService } from '../../grid/GridPosition.service'
import { ArticleModel } from '../../models/Article.model'
import { ContentType } from '../../models/ContentType'
import { TextContentModel as TextContentModel } from '../../models/TextContent.model'
import { TextContentService } from '../../services/TextContent.service'
import s from './TextContent.module.scss'

interface Props {
  article: ArticleModel
  content: TextContentModel
  index: number
  onClick?: () => any
  style?: CSSProperties
}

export const TextContent = observer((props: Props) => {
  const { article, content, index, style, onClick } = props
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
      fontSize: TextContentService.getResponsiveFontSize(format.fontSize),
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
    <motion.h1
      className={classNames(s.h1, formatClassNames)}
      style={{ ...formatStyle, ...style }}
      onClick={() => !!onClick && onClick()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.5 }}
    >
      {content.value}
      {article?.sponsored && (
        <div
          className={s.sponsoredTag}
          title="This content is from one of our sponsors"
        >
          Sponsored content
        </div>
      )}
    </motion.h1>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.5 }}
      className={formatClassNames}
      style={{ ...formatStyle, ...style }}
      onClick={() => !!onClick && onClick()}
    >
      <ReactMarkdown
        components={{
          link: ({ node }) => (
            <a href={node.url as string} rel="noreferrer" target="_blank">
              {node.children[0].value}
            </a>
          ),
        }}
      >
        {content.value}
      </ReactMarkdown>
    </motion.div>
  )
})
