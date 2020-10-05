import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { FitButtons } from '../Buttons/FitButtons'
import { Button } from '../../Button/Button'
import { SectionPresetButtons } from '../Buttons/SectionPresetButtons'
import { SortOrderButtons } from '../Buttons/SortOrderButtons'
import { runInAction } from 'mobx'
import { useEnv } from '../../../services/AppEnvironment'
import { SectionService } from '../../../domain/Section/Section.service'
import { ArticleService } from '../../../domain/Article/Article.service'
import {COLOR} from '../../../styles/color'

export const SectionControls = observer(() => {
  const env = useEnv()
  const { section, article } = env.adminSidebarStore
  const [deleting, setDeleting] = useState<boolean>(false)

  return (
    <>
      <section className="controls section">
        <label htmlFor="section-name">Name</label>
        <input
          type="text"
          id="section-name"
          placeholder={section.displayName}
          value={section.name || ''}
          onChange={(event) =>
            runInAction(() => (section.name = event.target.value))
          }
        />

        <label htmlFor="section-sort-order">Sort order</label>
        <SortOrderButtons
          id="section-sort-order"
          target={section}
          list={article.sections}
          forbidden={[0]}
        />

        <label htmlFor="fit">Content boundary</label>
        <FitButtons
          id="fit"
          selected={section.format.fit}
          onSelected={(v) => (section.format.fit = v)}
        />

        {section.sortOrder === 0 && (
          <>
            <label htmlFor="title-preset">Preset</label>
            <SectionPresetButtons
              id="title-preset"
              selected={section.preset}
              onSelected={(v) => SectionService.applyPreset(v, section)}
            />
          </>
        )}

        <Button
          onClick={() => {
            const duplicate = SectionService.duplicate(section)
            ArticleService.addSection(duplicate, article)
            env.adminSidebarStore.setSection(duplicate)
          }}
          disabled={section.uid === article.titleSection.uid}
        >
          Duplicate section
        </Button>

        <Button
          loading={deleting}
          color={COLOR.RED}
          loadingText="Deleting"
          onClick={() => {
            setDeleting(true)
            ArticleService.removeSection(section, env.adminSidebarStore.article)
            setDeleting(false)
          }}
          disabled={section.uid === article.titleSection.uid}
          tooltipText={
            section.uid === article.titleSection.uid
              ? "Title section can't be deleted"
              : null
          }
        >
          Delete section
        </Button>
      </section>
    </>
  )
})
