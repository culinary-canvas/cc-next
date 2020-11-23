import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../../../../../form/button/Button'
import { SectionPresetButtons } from '../shared/sectionPreset/SectionPresetButtons'
import { runInAction } from 'mobx'
import { SectionService } from '../../../../../../article/section/Section.service'
import { ArticleService } from '../../../../../../article/Article.service'
import { COLOR } from '../../../../../../styles/color'
import s from './SectionControls.module.scss'
import { useAdmin } from '../../../../../Admin'
import { ColorPicker } from '../shared/colorPicker/ColorPicker'
import { Checkbox } from '../../../../../../form/checkbox/Checkbox'
import { GridControl } from '../shared/gridControl/GridControl'
import { useAutorun } from '../../../../../../hooks/useAutorun'
import { SectionModel } from '../../../../../../article/section/Section.model'
import { HeightButtons } from '../shared/height/HeightButtons'

export const SectionControls = observer(() => {
  const admin = useAdmin()
  const { article } = admin

  const [deleting, setDeleting] = useState<boolean>(false)
  const [sections, setSections] = useState<SectionModel[]>([])
  const [section, setSection] = useState<SectionModel>()

  useAutorun(() => {
    setSections(article?.sections)
    setSection(admin.section)
  }, [article, admin.section])

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

        <label htmlFor="preset">Preset</label>
        <SectionPresetButtons
          id="preset"
          section={section}
          onSelected={(v) => SectionService.applyPreset(v, section)}
        />

        <label htmlFor="article-grid-placement">Grid placement</label>
        <GridControl
          id="article-grid-placement"
          parts={sections}
          columnDefinitions={['1fr', `3fr`, `3fr`, `3fr`, `3fr`, '1fr']}
          currentPart={section}
          outlierColumns={[1, 6]}
          onDelete={(parts) =>
            runInAction(() => {
              const uidsToDelete = parts.map((p) => p.uid)
              article.sections = article.sections.filter(
                (s) => !uidsToDelete.includes(s.uid),
              )
            })
          }
        />

        <HeightButtons
          selected={section.format.height}
          onSelected={(h) => runInAction(() => (section.format.height = h))}
        />

        <label htmlFor="section-background-color">Background color</label>
        <ColorPicker
          id="section-background-color"
          value={section.format.backgroundColor}
          onSelect={(c) =>
            runInAction(() => (section.format.backgroundColor = c))
          }
          includeTransparent
        />

        <Checkbox
          checked={section.format.shadow}
          onChange={(v) => runInAction(() => (section.format.shadow = v))}
          label="Shadow"
        />

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
