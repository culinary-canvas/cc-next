import React from 'react'
import { observer } from 'mobx-react'
import { ArticleControls } from './article/ArticleControls'
import { SectionControls } from './section/SectionControls'
import s from './Controls.module.scss'
import { Tabs } from '../../../../../shared/tabs/Tabs'
import { SectionModel } from '../../../../../article/section/Section.model'
import { ArticleService } from '../../../../../article/Article.service'
import { TextContentModel } from '../../../../../article/content/text/TextContent.model'
import { ContentControls } from './content/ContentControls'
import { ArticleModel } from '../../../../../article/Article.model'
import { useAdmin } from '../../../../Admin'

export const Controls = observer(() => {
  const admin = useAdmin()

  return (
    <>
      <Tabs tabs={['Article']} containerClassName={s.controlsTabsContainer}>
        <ArticleControls />
      </Tabs>

      <Tabs
        tabs={admin.article.sortedSections.map((s) => ({
          id: s.uid,
          label: s.displayName,
        }))}
        containerClassName={s.controlsTabsContainer}
        selected={admin.section?.uid}
        onSelect={(uid) =>
          admin.setSection(admin.article.sections.find((s) => s.uid === uid))
        }
        showAdd
        onAdd={() => {
          const newSection = new SectionModel()
          ArticleService.addSection(newSection, admin.article)
          admin.setSection(newSection)
        }}
      >
        {!!admin.section && <SectionControls />}
      </Tabs>

      {!!admin.section && (
        <Tabs
          tabs={admin.section.sortedContents.map((c) => ({
            id: c.uid,
            label: c.displayName,
          }))}
          containerClassName={s.controlsTabsContainer}
          selected={admin.content?.uid}
          onSelect={(uid) =>
            admin.setContent(admin.section.contents.find((c) => c.uid === uid))
          }
          showAdd
          onAdd={() => {
            const newContent = new TextContentModel()
            newContent.sortOrder = admin.section.contents.length
            admin.section.contents.push(newContent)
            admin.setContent(newContent)
          }}
        >
          {!!admin.content && <ContentControls />}
        </Tabs>
      )}
    </>
  )
})
