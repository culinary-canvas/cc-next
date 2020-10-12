import React, { CSSProperties, useState } from 'react'
import { SectionModel } from '../../../../article/section/Section.model'
import { observer } from 'mobx-react'
import { useAutorun } from '../../../../hooks/useAutorun'
import { ImageContentModel } from '../../../../article/content/image/ImageContent.model'
import { FormatService } from '../../../../article/shared/format/Format.service'
import { classnames } from '../../../../services/importHelpers'
import styles from './SectionEdit.module.scss'
import { useAdmin } from '../../../Admin'
import { SectionColumns } from '../../../../article/section/SectionColumns'
import { TextContentEdit } from '../content/text/TextContentEdit'
import { ImageContentEdit } from '../content/image/ImageContentEdit'

interface Props {
  section: SectionModel
  first?: boolean
}

export const SectionEdit = observer((props: Props) => {
  const admin = useAdmin()
  const { section, first = false } = props

  const [style, setStyle] = useState<CSSProperties>()

  useAutorun(() => {
    const gridTemplateColumns = FormatService.gridTemplateColumns(section)
    setStyle({ gridTemplateColumns })
  }, [section.format])

  return (
    <>
      <section
        role="button"
        tabIndex={0}
        onClick={() => admin.setSection(section)}
        onKeyUp={() => admin.setSection(section)}
        className={classnames([
          styles.container,
          styles[`fit-${section.format.fit}`],
          {
            [styles.inEdit]: admin.section.uid == section.uid,
          },
        ])}
        style={{ ...style }}
      >
        <SectionColumns
          section={section}
          textContent={(content, contentStyle) => (
            <TextContentEdit
              key={content.uid}
              content={content}
              style={{ ...contentStyle }}
            />
          )}
          imageContent={(content, contentStyle) => (
            <ImageContentEdit
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
