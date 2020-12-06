import React, { useState } from 'react'
import { Select } from '../../../../../../form/select/Select'
import { ContentType } from '../../../../../../article/content/ContentType'
import StringUtils from '../../../../../../services/utils/StringUtils'
import { ContentService } from '../../../../../../article/content/Content.service'
import { TextContentModel } from '../../../../../../article/content/text/TextContent.model'
import { TextControls } from './Text/TextControls'
import { ImageContentModel } from '../../../../../../article/content/image/ImageContent.model'
import { ImageControls } from './Image/ImageControls'
import { Button } from '../../../../../../form/button/Button'
import { COLOR } from '../../../../../../styles/color'
import { SectionService } from '../../../../../../article/section/Section.service'
import { observer } from 'mobx-react'
import s from './ContentControls.module.scss'
import { classnames } from '../../../../../../services/importHelpers'
import { useAdmin } from '../../../../../Admin'
import { GridControl } from '../shared/gridControl/GridControl'
import { runInAction } from 'mobx'
import { ColorPicker } from '../shared/colorPicker/ColorPicker'

export const ContentControls = observer(() => {
  const admin = useAdmin()
  const [deleting, setDeleting] = useState<boolean>(false)
  const { content, section, article } = admin
  if (!content || !section || !article) {
    return null
  }

  return (
    <section className={classnames(s.controls)}>
      <label htmlFor="content-type">Type</label>
      <Select
        id="content-type"
        value={content.type}
        options={Object.values(ContentType)}
        displayFormatter={(v) => StringUtils.toDisplayText(v)}
        onChange={(type) => {
          const contentIndex = section.contents.findIndex(
            (c) => c.uid === content.uid,
          )
          const appliedContent = ContentService.getTypeAppliedContent(
            content,
            type,
          )
          section.contents.splice(contentIndex, 1, appliedContent)
          admin.setContent(appliedContent)
        }}
      />

      <label htmlFor="contents-grid-placement">Grid placement</label>
      <GridControl
        id="contents-grid-placement"
        parts={section.contents}
        columnDefinitions={['1fr', '1fr', '1fr', '1fr']}
        currentPart={content}
        onDelete={(parts) =>
          runInAction(() => {
            const uidsToDelete = parts.map((p) => p.uid)
            section.contents = section.contents.filter(
              (s) => !uidsToDelete.includes(s.uid),
            )
          })
        }
      />

      <label htmlFor="content-background-color">Background color</label>
      <ColorPicker
        id="content-background-color"
        value={content.format.backgroundColor}
        onSelect={(c) =>
          runInAction(() => (content.format.backgroundColor = c))
        }
        additionalColors={article.colors}
        showTransparent
      />

      {content instanceof TextContentModel && <TextControls />}

      {content instanceof ImageContentModel && <ImageControls />}

      <Button
        loading={deleting}
        color={COLOR.RED}
        loadingText="Deleting"
        onClick={() => {
          setDeleting(true)
          SectionService.removeContent(content, section)
          setDeleting(false)
        }}
        disabled={
          section.uid === article.titleSection.uid &&
          content.type === ContentType.TITLE
        }
        title={
          section.uid === article.titleSection.uid &&
          content.type === ContentType.TITLE
            ? "Title section can't be deleted"
            : null
        }
      >
        Delete
      </Button>
    </section>
  )
})
