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
import { useEnv } from '../../../services/AppEnvironment'

export const Controls = observer(() => {
  const env = useEnv()

  return (
    <>
      <Tabs tabs={['Article']} containerClassName={s.controlsTabsContainer}>
        <ArticleControls />
      </Tabs>

      <Tabs
        tabs={env.adminStore.article.sortedSections.map((s) => ({
          id: s.uid,
          label: s.displayName,
        }))}
        containerClassName={s.controlsTabsContainer}
        selected={env.adminStore.section?.uid}
        onSelect={(uid) =>
          env.adminStore.setSection(
            env.adminStore.article.sections.find((s) => s.uid === uid),
          )
        }
        showAdd
        onAdd={() => {
          const newSection = new Section()
          ArticleService.addSection(newSection, env.adminStore.article)
          env.adminStore.setSection(newSection)
        }}
      >
        {!!env.adminStore.section && <SectionControls />}
      </Tabs>

      {!!env.adminStore.section && (
        <Tabs
          tabs={env.adminStore.section.sortedContents.map((c) => ({
            id: c.uid,
            label: c.displayName,
          }))}
          containerClassName={s.controlsTabsContainer}
          selected={env.adminStore.content?.uid}
          onSelect={(uid) =>
            env.adminStore.setContent(
              env.adminStore.section.contents.find((c) => c.uid === uid),
            )
          }
          showAdd
          onAdd={() => {
            const newContent = new TextContent()
            newContent.sortOrder = env.adminStore.section.contents.length
            env.adminStore.section.contents.push(newContent)
            env.adminStore.setContent(newContent)
          }}
        >
          {!!env.adminStore.content && <ContentControls />}
        </Tabs>
      )}
    </>
  )
})
