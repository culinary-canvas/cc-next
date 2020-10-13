import React, { useState } from 'react'
import { Select } from '../../../../../../form/select/Select'
import { ContentType } from '../../../../../../article/content/ContentType'
import StringUtils from '../../../../../../services/utils/StringUtils'
import { ContentService } from '../../../../../../article/content/Content.service'
import { SortOrderButtons } from '../shared/sortOrder/SortOrderButtons'
import { AlignToPreviousButtons } from '../shared/alignToPrevious/AlignToPreviousButtons'
import { Slider } from '../../../../../../form/slider/Slider'
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

      <label htmlFor="content-sort-order">Sort order</label>
      <SortOrderButtons
        id="content-sort-order"
        target={content}
        list={section.contents}
      />

      <label htmlFor="align-to-previous">Align to previous</label>
      <AlignToPreviousButtons
        selected={content.alignToPrevious}
        onSelected={(v) => (content.alignToPrevious = v)}
        id="align-to-previous"
        disabled={content.sortOrder === 0}
      />

      <Slider
        label="Column width"
        value={content.format.gridColumnWidth * 100}
        min={1}
        max={section.columns.length === 1 ? 100 : 500}
        step={4}
        onChange={(v) =>
          SectionService.getColumnContainingContent(section, content).forEach(
            (c) => (c.format.gridColumnWidth = v / 100),
          )
        }
      />

      {content instanceof TextContentModel && <TextControls content={content} />}

      {content instanceof ImageContentModel && (
        <ImageControls content={content} section={section} />
      )}

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
