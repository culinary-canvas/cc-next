import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { SectionModel } from '../../../../article/section/Section.model'
import { observer } from 'mobx-react'
import { useAutorun } from '../../../../hooks/useAutorun'
import { ImageContentModel } from '../../../../article/content/image/ImageContent.model'
import { classnames } from '../../../../services/importHelpers'
import styles from './SectionEdit.module.scss'
import { useAdmin } from '../../../Admin'
import { TextContentEdit } from '../content/text/TextContentEdit'
import { ImageContentEdit } from '../content/image/ImageContentEdit'
import { GridPositionService } from '../../../../article/grid/GridPosition.service'
import { TextContentModel } from '../../../../article/content/text/TextContent.model'
import { TextContent } from '../../../../article/content/text/TextContent'

interface Props {
  section: SectionModel
  first: boolean
}

export const SectionEdit = observer((props: Props) => {
  const admin = useAdmin()
  const { section, first } = props

  const [style, setStyle] = useState<CSSProperties>()
  const ref = useRef<HTMLElement>()

  useAutorun(() => {
    const css: CSSProperties = {}
    if (section.format.backgroundColor) {
      css.backgroundColor = section.format.backgroundColor
    }
    const gridCss = GridPositionService.gridPositionAsCss(
      section.format.gridPosition,
    )
    setStyle({ ...css, ...gridCss })
  }, [section.format])

  return (
    <>
      <section
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={() => admin.setSection(section)}
        onKeyUp={() => admin.setSection(section)}
        className={classnames([
          styles.container,
          styles[`height-${section.format.height}`],
          {
            [styles.inEdit]: admin.section.uid == section.uid,
            [styles.shadow]: section.format.shadow,
          },
        ])}
        style={{ ...style }}
      >
        {section.contents.map((content) =>
          content instanceof TextContentModel ? (
            admin.content.uid === content.uid ? (
              <TextContentEdit key={content.uid} content={content} />
            ) : (
              <TextContent
                key={content.uid}
                content={content}
                onClick={() => admin.setContent(content)}
              />
            )
          ) : (
            <ImageContentEdit
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
