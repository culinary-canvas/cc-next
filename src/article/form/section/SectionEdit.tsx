import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { ArticleModel } from '../../models/Article.model'
import { SectionModel } from '../../models/Section.model'
import { observer } from 'mobx-react-lite'
import { useAutorun } from '../../../hooks/useAutorun'
import { ImageContentModel } from '../../models/ImageContent.model'
import { classnames } from '../../../services/importHelpers'
import styles from './SectionEdit.module.scss'
import { useAdmin } from '../../../admin/Admin.context'
import { TextContentEdit } from '../text/TextContentEdit'
import { ImageContentEdit } from '../image/ImageContentEdit'
import { GridPositionService } from '../../grid/GridPosition.service'
import { TextContentModel } from '../../models/TextContent.model'
import { TextContent } from '../../content/text/TextContent'

interface Props {
  article: ArticleModel
  section: SectionModel
  first: boolean
}

export const SectionEdit = observer((props: Props) => {
  const admin = useAdmin()
  const { section, first, article } = props

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
        {section.contents.map((content, i) =>
          content instanceof TextContentModel ? (
            admin.content?.uid === content.uid ? (
              <TextContentEdit key={content.uid} content={content} />
            ) : (
              <TextContent
                article={article}
                key={content.uid}
                content={content}
                onClick={() => admin.setContent(content)}
                index={i}
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
