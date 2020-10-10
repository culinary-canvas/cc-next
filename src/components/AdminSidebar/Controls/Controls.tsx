import React from 'react'
import { observer } from 'mobx-react'
import { ArticleControls } from './Article/ArticleControls'
import { SectionControls } from './Section/SectionControls'
import s from './Controls.module.scss'
import { Tabs } from '../../Tabs/Tabs'
import { Section } from '../../../domain/Section/Section'
import { ArticleService } from '../../../domain/Article/Article.service'
import { TextContent } from '../../../domain/Text/TextContent'
import { ContentControls } from './Content/ContentControls'
import { Article } from '../../../domain/Article/Article'
import { useAdmin } from '../../../services/admin/Admin.store'

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
          const newSection = new Section()
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
            const newContent = new TextContent()
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
