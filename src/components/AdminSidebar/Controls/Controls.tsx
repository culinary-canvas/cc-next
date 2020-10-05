import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { ArticleControls } from './ArticleControls'
import { SectionControls } from './SectionControls'
import './Controls.module.scss'
import { Tabs } from '../../Tabs/Tabs'
import { TextControls } from './TextControls'
import { ImageControls } from './ImageControls'
import { Select } from '../../Select/Select'
import { OrientationButtons } from '../Buttons/OrientationButtons'
import { Button } from '../../Button/Button'
import { SortOrderButtons } from '../Buttons/SortOrderButtons'
import { Slider } from '../../Slider/Slider'
import { useEnv } from '../../../services/AppEnvironment'
import { Section } from '../../../domain/Section/Section'
import { ArticleService } from '../../../domain/Article/Article.service'
import { ContentType } from '../../../domain/Text/ContentType'
import StringUtils from '../../../services/utils/StringUtils'
import { ContentService } from '../../../domain/Content/Content.service'
import { TextContent } from '../../../domain/Text/TextContent'
import { ImageContent } from '../../../domain/Image/ImageContent'
import { SectionService } from '../../../domain/Section/Section.service'
import {COLOR} from '../../../styles/color'

export const Controls = observer(() => {
  const env = useEnv()
  const { adminSidebarStore: store } = env

  const [deleting, setDeleting] = useState<boolean>(false)

  return (
    <>
      <Tabs
        tabs={['Article']}
        containerClassName="controls-tabs-container article"
      >
        <ArticleControls />
      </Tabs>
      <Tabs
        tabs={store.article.sortedSections.map((s) => ({
          id: s.uid,
          label: s.displayName,
        }))}
        containerClassName="controls-tabs-container"
        selected={store.section?.uid}
        onSelect={(uid) =>
          store.setSection(store.article.sections.find((s) => s.uid === uid))
        }
        showAdd
        onAdd={() => {
          const newSection = new Section()
          ArticleService.addSection(newSection, store.article)
          store.setSection(newSection)
        }}
      >
        <SectionControls />
      </Tabs>
      {!!store.section && (
        <Tabs
          tabs={store.section.sortedContents.map((c) => ({
            id: c.uid,
            label: c.displayName,
          }))}
          containerClassName="controls-tabs-container"
          selected={store.content?.uid}
          onSelect={(uid) =>
            store.setContent(store.section.contents.find((c) => c.uid === uid))
          }
          showAdd
          onAdd={() => {
            const newContent = new TextContent()
            newContent.sortOrder = store.section.contents.length
            store.section.contents.push(newContent)
            store.setContent(newContent)
          }}
        >
          <section className="content controls">
            {!!store.content && (
              <>
                <label htmlFor="content-type">Type</label>
                <Select
                  id="content-type"
                  value={store.content.type}
                  options={Object.values(ContentType)}
                  displayFormatter={(v) => StringUtils.toDisplayText(v)}
                  onChange={(type) => {
                    const contentIndex = store.section.contents.findIndex(
                      (c) => c.uid === store.content.uid,
                    )
                    const appliedContent = ContentService.getTypeAppliedContent(
                      store.content,
                      type,
                    )
                    store.section.contents.splice(
                      contentIndex,
                      1,
                      appliedContent,
                    )
                    store.setContent(appliedContent)
                  }}
                />

                <label htmlFor="content-sort-order">Sort order</label>
                <SortOrderButtons
                  id="content-sort-order"
                  target={store.content}
                  list={store.section.contents}
                />

                <label htmlFor="align-to-previous">Align to previous</label>
                <OrientationButtons
                  selected={store.content.alignToPrevious}
                  onSelected={(v) => (store.content.alignToPrevious = v)}
                  id="align-to-previous"
                  disabled={store.content.sortOrder === 0}
                />

                <Slider
                  label="Column width"
                  value={store.content.format.gridColumnWidth * 100}
                  min={1}
                  max={store.section.columns.length === 1 ? 100 : 500}
                  step={4}
                  onChange={(v) =>
                    store.contentColumn.forEach(
                      (c) => (c.format.gridColumnWidth = v / 100),
                    )
                  }
                />

                {store.content instanceof TextContent && <TextControls />}
                {store.content instanceof ImageContent && <ImageControls />}

                <Button
                  loading={deleting}
                  color={COLOR.RED}
                  loadingText="Deleting"
                  onClick={() => {
                    setDeleting(true)
                    SectionService.removeContent(store.content, store.section)
                    setDeleting(false)
                  }}
                  disabled={
                    store.section.uid === store.article.titleSection.uid &&
                    store.content.type === ContentType.TITLE
                  }
                  tooltipText={
                    store.section.uid === store.article.titleSection.uid &&
                    store.content.type === ContentType.TITLE
                      ? "Title section can't be deleted"
                      : null
                  }
                >
                  Delete
                </Button>
              </>
            )}
          </section>
        </Tabs>
      )}
    </>
  )
})
