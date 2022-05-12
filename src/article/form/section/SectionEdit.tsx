import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useRef, useState } from 'react'
import { useAdmin } from '../../../admin/Admin.context'
import { useAutorun } from '../../../hooks/useAutorun'
import { classnames } from '../../../services/importHelpers'
import { GridPositionService } from '../../grid/GridPosition.service'
import { ArticleModel } from '../../models/Article.model'
import { SectionModel } from '../../models/Section.model'
import { ContentEdit } from '../content/ContentEdit'
import styles from './SectionEdit.module.scss'

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
        {section.contents.map((content, i) => (
          <ContentEdit
            key={content.uid}
            content={content}
            article={article}
            section={section}
            first={first}
            index={i}
          />
        ))}
      </section>
    </>
  )
})
