import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../../../../shared/button/Button'
import { SectionPresetButtons } from '../shared/sectionPreset/SectionPresetButtons'
import { runInAction } from 'mobx'
import { SectionService } from '../../../../section/Section.service'
import { ArticleService } from '../../../../Article.service'
import { COLOR } from '../../../../../styles/_color'
import s from './SectionControls.module.scss'
import { useAdmin } from '../../../../../admin/Admin.context'
import { ColorPicker } from '../shared/colorPicker/ColorPicker'
import { Checkbox } from '../../../../../shared/checkbox/Checkbox'
import { GridControl } from '../shared/gridControl/GridControl'
import { useAutorun } from '../../../../../hooks/useAutorun'
import { SectionModel } from '../../../../models/Section.model'
import { HeightButtons } from '../shared/height/HeightButtons'
import { Modal } from '../../../../../shared/modal/Modal'
import { ControlContainer } from '../shared/controlContainer/ControlContainer'

export const SectionControls = observer(() => {
  const admin = useAdmin()
  const { article } = admin

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
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
        <ControlContainer label="Name" id="section-name">
          <input
            type="text"
            id="section-name"
            placeholder={section.displayName}
            value={section.name || ''}
            onChange={(event) =>
              runInAction(() => (section.name = event.target.value))
            }
          />
        </ControlContainer>

        <ControlContainer label="Preset" id="section-preset">
          <SectionPresetButtons
            id="section-preset"
            section={section}
            onSelected={(v) => SectionService.applyPreset(v, section)}
          />
        </ControlContainer>

        <ControlContainer label="Grid placement" id="article-grid-placement">
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
        </ControlContainer>

        <ControlContainer label="Height" id="section-height">
          <HeightButtons
            selected={section.format.height}
            onSelected={(h) => runInAction(() => (section.format.height = h))}
          />
        </ControlContainer>

        <ControlContainer id="section-background" label="Background">
          <ColorPicker
            id="section-background"
            value={section.format.backgroundColor}
            onSelect={(c) =>
              runInAction(() => (section.format.backgroundColor = c))
            }
            additionalColors={article.colors}
            showTransparent
          />
          <Checkbox
            checked={section.format.shadow}
            onChange={(v) => runInAction(() => (section.format.shadow = v))}
            label="Shadow"
          />
        </ControlContainer>

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
          onClick={() => setShowDeleteModal(true)}
          disabled={section.uid === article.titleSection.uid}
          title={
            section.uid === article.titleSection.uid
              ? "Title section can't be deleted"
              : null
          }
        >
          Delete section
        </Button>

        {showDeleteModal && (
          <Modal
            dark
            style={{ position: 'absolute', bottom: '1rem', width: '90%' }}
            title="Confirm"
            message={`Are you sure you want to delete "${section.displayName}"?`}
            onOk={() => {
              setShowDeleteModal(false)
              setDeleting(true)
              ArticleService.removeSection(section, article)
              setDeleting(false)
            }}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </section>
    </>
  )
})
