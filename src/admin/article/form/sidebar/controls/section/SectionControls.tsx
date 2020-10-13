import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { FitButtons } from '../shared/fit/FitButtons'
import { Button } from '../../../../../../form/button/Button'
import { SectionPresetButtons } from '../shared/sectionPreset/SectionPresetButtons'
import { SortOrderButtons } from '../shared/sortOrder/SortOrderButtons'
import { runInAction } from 'mobx'
import { SectionService } from '../../../../../../article/section/Section.service'
import { ArticleService } from '../../../../../../article/Article.service'
import { COLOR } from '../../../../../../styles/color'
import s from './SectionControls.module.scss'
import { useAdmin } from '../../../../../Admin'

export const SectionControls = observer(() => {
  const admin = useAdmin()
  const [deleting, setDeleting] = useState<boolean>(false)

  const { section, article } = admin

  if (!article || !section) {
    return null
  }

  return (
    <>
      <section className={s.controls}>
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
            admin.setSection(duplicate)
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
            ArticleService.removeSection(section, article)
            setDeleting(false)
          }}
          disabled={section.uid === article.titleSection.uid}
          title={
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
