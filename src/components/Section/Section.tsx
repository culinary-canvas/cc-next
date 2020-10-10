import React, { CSSProperties, useState } from 'react'
import { Section as _Section } from '../../domain/Section/Section'
import { observer } from 'mobx-react'
import { ImageContent } from '../ImageContent/ImageContent'
import { useAutorun } from '../../hooks/useAutorun'
import { TextContent as _TextContent } from '../../domain/Text/TextContent'
import { ImageContent as _ImageContent } from '../../domain/Image/ImageContent'
import { useEnv } from '../../services/AppEnvironment'
import { FormatService } from '../../domain/Format/Format.service'
import { classnames } from '../../services/importHelpers'
import { TextContent } from '../TextContent/TextContent'
import styles from './Section.module.scss'
import fitStyles from './Section.fit.module.scss'

interface Props {
  section: _Section
  first?: boolean
  edit?: boolean
}

export const Section = observer((props: Props) => {
  const env = useEnv()
  const { section, edit = false, first = false } = props

  const [style, setStyle] = useState<CSSProperties>()

  // TODO change to useMemo?

  useAutorun(() => {
    const gridTemplateColumns = FormatService.gridTemplateColumns(section)
    setStyle({ gridTemplateColumns })
  }, [section.format])

  return (
    <>
      <section
        role={!!edit ? 'button' : first ? 'header' : 'section'}
        tabIndex={0}
        onClick={() => edit && env.adminStore.setSection(section)}
        onKeyUp={() => edit && env.adminStore.setSection(section)}
        className={classnames([
          styles.container,
          fitStyles[`fit-${section.format.fit}`],
          {
            [styles.inEdit]: edit && env.adminStore.section.uid == section.uid,
          },
        ])}
        style={{ ...style }}
      >
        {section.columns.map((column, columnIndex) => {
          let gridRowStart = 0
          let previousWasBackground = false

          return column.map((content, contentIndex) => {
            const oneBasedIndex = contentIndex + 1
            if (!previousWasBackground) {
              gridRowStart++
            }
            previousWasBackground = content.format.background

            const rowSpan = content.format.background
              ? column.filter((c) => !c.format.background).length
              : oneBasedIndex === column.length
              ? section.rowsLength - contentIndex
              : 1

            const columnSpan = content.format.background
              ? section.columns.length
              : 1

            const contentStyle = {
              gridColumnStart: columnIndex + 1,
              gridColumnEnd: `span ${columnSpan}`,
              gridRowEnd: `span ${rowSpan}`,
              gridRowStart,
            }
            return content instanceof _TextContent ? (
              <TextContent
                key={content.uid}
                content={content}
                edit={edit}
                style={{ ...contentStyle }}
              />
            ) : (
              <ImageContent
                key={content.uid}
                content={content as _ImageContent}
                section={section}
                edit={edit}
                first={first}
                style={{ ...contentStyle }}
              />
            )
          })
        })}
      </section>
    </>
  )
})
