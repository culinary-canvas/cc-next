import React from 'react'
import { observer } from 'mobx-react'
import { ArticleControls } from './article/ArticleControls'
import s from './Controls.module.scss'
import { Tabs } from '../../../../../shared/tabs/Tabs'
import { useAdmin } from '../../../../Admin'
import { ArticleFormModeSelect } from './shared/modeSelect/ArticleFormModeSelect'
import { ArticlePreviewControls } from './preview/ArticlePreviewControls'
import { SectionService } from '../../../../../article/section/Section.service'
import { ContentService } from '../../../../../article/content/Content.service'
import { SectionControls } from './section/SectionControls'
import { ArticleService } from '../../../../../article/Article.service'
import { ContentControls } from './content/ContentControls'

export const Controls = observer(() => {
  const admin = useAdmin()
  if (!admin.article) {
    return null
  }

  return (
    <>
      <ArticleFormModeSelect />

      {admin.mode === 'preview' ? (
        <Tabs tabs={['Preview']} containerClassName={s.controlsTabsContainer}>
          <ArticlePreviewControls />
        </Tabs>
      ) : (
        <>
          <Tabs tabs={['Article']} containerClassName={s.controlsTabsContainer}>
            <ArticleControls />
          </Tabs>

          <Tabs
            tabs={admin.article.sections.map((s) => ({
              id: s.uid,
              label: s.displayName,
            }))}
            containerClassName={s.controlsTabsContainer}
            selected={admin.section?.uid}
            onSelect={(uid) =>
              admin.setSection(
                admin.article.sections.find((s) => s.uid === uid),
              )
            }
            showAdd
            onAdd={() => {
              const newSection = SectionService.create()
              ArticleService.addSection(newSection, admin.article)
              admin.setSection(newSection)
            }}
          >
            {!!admin.section && <SectionControls />}
          </Tabs>

          {!!admin.section && (
            <Tabs
              tabs={admin.section.contents.map((c) => ({
                id: c.uid,
                label: c.displayName,
              }))}
              containerClassName={s.controlsTabsContainer}
              selected={admin.content?.uid}
              onSelect={(uid) =>
                admin.setContent(
                  admin.section.contents.find((c) => c.uid === uid),
                )
              }
              showAdd
              onAdd={() => {
                const newContent = ContentService.create()
                SectionService.addContent(newContent, admin.section)
                admin.setContent(newContent)
              }}
            >
              {!!admin.content && <ContentControls />}
            </Tabs>
          )}
        </>
      )}
    </>
  )
})
