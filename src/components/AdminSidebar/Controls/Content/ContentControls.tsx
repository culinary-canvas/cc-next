import React, { useState } from 'react'
import { Content } from '../../../../domain/Content/Content'
import { Select } from '../../../Select/Select'
import { ContentType } from '../../../../domain/Text/ContentType'
import StringUtils from '../../../../services/utils/StringUtils'
import { ContentService } from '../../../../domain/Content/Content.service'
import { SortOrderButtons } from '../Elements/SortOrderButtons/SortOrderButtons'
import { AlignToPreviousButtons } from '../Elements/AlignToPreviousButtons/AlignToPreviousButtons'
import { Slider } from '../../../Slider/Slider'
import { TextContent } from '../../../../domain/Text/TextContent'
import { TextControls } from './Text/TextControls'
import { ImageContent } from '../../../../domain/Image/ImageContent'
import { ImageControls } from './Image/ImageControls'
import { Button } from '../../../Button/Button'
import { COLOR } from '../../../../styles/color'
import { SectionService } from '../../../../domain/Section/Section.service'
import { useEnv } from '../../../../services/AppEnvironment'
import { observer } from 'mobx-react'
import s from './ContentControls.module.scss'
import { classnames } from '../../../../services/importHelpers'
import { Section } from '../../../../domain/Section/Section'
import { Article } from '../../../../domain/Article/Article'
import { useAutorun } from '../../../../hooks/useAutorun'

export const ContentControls = observer(() => {
  const env = useEnv()
  const [content, setContent] = useState<Content>()
  const [section, setSection] = useState<Section>()
  const [article, setArticle] = useState<Article>()
  const [deleting, setDeleting] = useState<boolean>(false)

  useAutorun(() => setContent(env.adminStore.content))
  useAutorun(() => setSection(env.adminStore.section))
  useAutorun(() => setArticle(env.adminStore.article))

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
          env.adminStore.setContent(appliedContent)
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

      {content instanceof TextContent && <TextControls content={content} />}

      {content instanceof ImageContent && (
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
        tooltipText={
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
