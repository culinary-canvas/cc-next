import React, { CSSProperties, useEffect, useState } from 'react'
import { SectionModel } from './Section.model'
import { observer } from 'mobx-react'
import { ImageContentModel } from '../content/image/ImageContent.model'
import { FormatService } from '../shared/format/Format.service'
import { classnames } from '../../services/importHelpers'
import styles from './Section.module.scss'
import { SectionColumns } from './SectionColumns'
import { TextContent } from '../content/text/TextContent'
import { ImageContent } from '../content/image/ImageContent'

interface Props {
  section: SectionModel
  first: boolean
}

export const Section = observer((props: Props) => {
  const { section, first } = props
  const [style, setStyle] = useState<CSSProperties>()

  useEffect(() => {
    const gridTemplateColumns = FormatService.gridTemplateColumns(section)
    setStyle({ gridTemplateColumns })
  }, [section])

  return (
    <>
      <section
        className={classnames([
          styles.container,
          styles[`fit-${section.format.fit}`],
        ])}
        style={{ ...style }}
      >
        <SectionColumns
          section={section}
          textContent={(content, contentStyle) => (
            <TextContent
              key={content.uid}
              content={content}
              style={{ ...contentStyle }}
            />
          )}
          imageContent={(content, contentStyle) => (
            <ImageContent
              key={content.uid}
              content={content as ImageContentModel}
              section={section}
              first={first}
              style={{ ...contentStyle }}
            />
          )}
        />
      </section>
    </>
  )
})
