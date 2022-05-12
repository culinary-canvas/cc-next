import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useEffect, useState } from 'react'
import { classnames } from '../../services/importHelpers'
import { ImageContent } from '../content/image/ImageContent'
import { IssueContent } from '../content/issue/IssueContent'
import { TextContent } from '../content/text/TextContent'
import { GridPositionService } from '../grid/GridPosition.service'
import { ArticleModel } from '../models/Article.model'
import { ImageContentModel } from '../models/ImageContent.model'
import { IssueContentModel } from '../models/IssueContent.model'
import { SectionModel } from '../models/Section.model'
import { TextContentModel } from '../models/TextContent.model'
import s from './Section.module.scss'

interface Props {
  article: ArticleModel
  section: SectionModel
  first: boolean
}

export const Section = observer((props: Props) => {
  const { article, section, first } = props
  const [style, setStyle] = useState<CSSProperties>()

  useEffect(() => {
    const css: CSSProperties = {}
    if (section.format.backgroundColor) {
      css.backgroundColor = section.format.backgroundColor
    }
    const gridCss = GridPositionService.gridPositionAsCss(
      section.format.gridPosition,
    )
    setStyle({ ...css, ...gridCss })
  }, [section])

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: first ? 0 : 1 }}
        className={classnames([
          s.container,
          s[`height-${section.format.height}`],
          { [s.shadow]: section.format.shadow },
        ])}
        style={{ ...style }}
      >
        {section.contents.map((content, i) =>
          content instanceof TextContentModel ? (
            <TextContent
              key={content.uid}
              article={article}
              content={content}
              index={i}
            />
          ) : content instanceof IssueContentModel ? (
            <IssueContent
              article={article}
              content={content}
              key={content.uid}
            />
          ) : (
            <ImageContent
              key={content.uid}
              content={content as ImageContentModel}
              section={section}
              first={first}
              index={i}
            />
          ),
        )}
      </motion.section>
    </>
  )
})
