import React, { CSSProperties, ReactElement } from 'react'
import { SectionModel } from './Section.model'
import { TextContentModel } from '../content/text/TextContent.model'
import { ImageContentModel } from '../content/image/ImageContent.model'

interface Props {
  section: SectionModel
  textContent: (content: TextContentModel, style: CSSProperties) => ReactElement
  imageContent: (content: ImageContentModel, style: CSSProperties) => ReactElement
}

export function SectionColumns(props: Props) {
  const { textContent, imageContent, section } = props

  return (
    <>
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

          const style = {
            gridColumnStart: columnIndex + 1,
            gridColumnEnd: `span ${columnSpan}`,
            gridRowEnd: `span ${rowSpan}`,
            gridRowStart,
          }
          return content instanceof TextContentModel
            ? textContent(content as TextContentModel, style)
            : imageContent(content as ImageContentModel, style)
        })
      })}
    </>
  )
}
