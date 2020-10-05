import React, { CSSProperties, useState } from 'react'
import { Section as _Section } from '../../domain/Section/Section'
import { observer } from 'mobx-react'
import { TextContent } from './TextContent'
import { ImageContent } from './ImageContent'
import { useAutorun } from '../../hooks/useAutorun'
import { TextContent as _TextContent } from '../../domain/Text/TextContent'
import { ImageContent as _ImageContent } from '../../domain/Image/ImageContent'
import { useEnv } from '../../services/AppEnvironment'
import { FormatService } from '../../domain/Format/Format.service'
import { classnames } from '../../services/importHelpers'

interface Props {
  section: _Section
  first?: boolean
  edit?: boolean
  preview?: boolean
  promoted?: boolean
  inheritedClassName?: string
}

export const Section = observer((props: Props) => {
  const env = useEnv()
  const {
    section,
    edit = false,
    preview,
    promoted,
    inheritedClassName = '',
    first,
  } = props

  const [style, setStyle] = useState<CSSProperties>()
  const [classNames, setClassNames] = useState<string[]>()

  useAutorun(() => {
    const {
      classNames: c,
      style: s,
    } = FormatService.getApplicableSectionFormat(section)
    setStyle(s)
    setClassNames(c)
  }, [section.format])

  return (
    <>
      <section
        role={!!edit ? 'button' : first ? 'header' : 'section'}
        tabIndex={0}
        onClick={
          edit ? () => env.adminSidebarStore.setSection(section) : undefined
        }
        onKeyUp={
          edit ? () => env.adminSidebarStore.setSection(section) : undefined
        }
        className={classnames([
          'container',
          'section',
          classNames,
          inheritedClassName,
          { 'in-edit': env.adminSidebarStore.isSectionInEdit(section) },
        ])}
        style={{ ...style }}
      >
        {section.columns.map((column, columnIndex) => {
          let gridRowStart = 0
          let previousWasBackground = false

          return column.map((content, contentIndex) => {
            const oneBasedIndex = contentIndex + 1
            if ((preview && !promoted) || !previousWasBackground) {
              gridRowStart++
            }
            previousWasBackground =
              (!preview || promoted) && content.format.background

            const rowSpan =
              (!preview || promoted) && content.format.background
                ? column.filter((c) => !c.format.background).length
                : oneBasedIndex === column.length
                ? section.rowsLength - contentIndex
                : 1

            const columnSpan =
              (!preview || promoted) && content.format.background
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
                inheritedClassName={classnames(classNames, inheritedClassName)}
                style={{ ...contentStyle }}
              />
            ) : (
              <ImageContent
                key={content.uid}
                content={content as _ImageContent}
                section={section}
                edit={edit}
                inheritedClassName={classnames(classNames, inheritedClassName)}
                onFocus={() => env.adminSidebarStore.setContent(content)}
                style={{ ...contentStyle }}
              />
            )
          })
        })}
      </section>
    </>
  )
})
