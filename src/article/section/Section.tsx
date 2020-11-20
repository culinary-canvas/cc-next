import React, { CSSProperties, useEffect, useState } from 'react'
import { SectionModel } from './Section.model'
import { observer } from 'mobx-react'
import { ImageContentModel } from '../content/image/ImageContent.model'
import { classnames } from '../../services/importHelpers'
import styles from './Section.module.scss'
import { SectionColumns } from './SectionColumns'
import { TextContent } from '../content/text/TextContent'
import { ImageContent } from '../content/image/ImageContent'
import { GridPositionService } from '../grid/GridPosition.service'
import { TextContentModel } from '../content/text/TextContent.model'

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
      <section
        className={classnames([
          styles.container,
          styles[`height-${section.format.height}`],
          { [styles.shadow]: section.format.shadow },
        ])}
        style={{ ...style }}
      >
        {section.contents.map((content) =>
          content instanceof TextContentModel ? (
            <TextContent key={content.uid} content={content} />
          ) : (
            <ImageContent
              key={content.uid}
              content={content as ImageContentModel}
              section={section}
              first={first}
            />
          ),
        )}
      </section>
    </>
  )
})
