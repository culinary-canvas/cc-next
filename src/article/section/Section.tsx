import React, { CSSProperties, useEffect, useState } from 'react'
import { SectionModel } from '../models/Section.model'
import { observer } from 'mobx-react'
import { ImageContentModel } from '../models/ImageContent.model'
import { classnames } from '../../services/importHelpers'
import s from './Section.module.scss'
import { TextContent } from '../content/text/TextContent'
import { ImageContent } from '../content/image/ImageContent'
import { GridPositionService } from '../grid/GridPosition.service'
import { TextContentModel } from '../models/TextContent.model'
import { motion } from 'framer-motion'

interface Props {
  section: SectionModel
  first: boolean
}

export const Section = observer((props: Props) => {
  const { section, first } = props
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
            <TextContent key={content.uid} content={content} index={i} />
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
