import React, { useState } from 'react'
import { Select } from '../../../../../shared/select/Select'
import { ContentType } from '../../../../models/ContentType'
import StringUtils from '../../../../../services/utils/StringUtils'
import { ContentService } from '../../../../services/Content.service'
import { TextContentModel } from '../../../../models/TextContent.model'
import { TextControls } from './Text/TextControls'
import { ImageContentModel } from '../../../../models/ImageContent.model'
import { ImageControls } from './Image/ImageControls'
import { Button } from '../../../../../shared/button/Button'
import { COLOR } from '../../../../../styles/_color'
import { observer } from 'mobx-react'
import s from './ContentControls.module.scss'
import { classnames } from '../../../../../services/importHelpers'
import { useAdmin } from '../../../../../admin/Admin.context'
import { GridControl } from '../shared/gridControl/GridControl'
import { runInAction } from 'mobx'
import { Modal } from '../../../../../shared/modal/Modal'
import { SectionService } from '../../../../section/Section.service'
import { ControlContainer } from '../shared/controlContainer/ControlContainer'

export const ContentControls = observer(() => {
  const admin = useAdmin()
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  const { content, section, article } = admin
  if (!content || !section || !article) {
    return null
  }

  return (
    <section className={classnames(s.controls)}>
      <ControlContainer id="content-type" label="Type">
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
            admin.setContent(appliedContent)
          }}
        />
      </ControlContainer>

      <ControlContainer id="contents-grid-placement" label="Grid placement">
        <GridControl
          id="contents-grid-placement"
          parts={section.contents}
          columnDefinitions={['1fr', '1fr', '1fr', '1fr']}
          currentPart={content}
          onDelete={(parts) =>
            runInAction(() => {
              const uidsToDelete = parts.map((p) => p.uid)
              section.contents = section.contents.filter(
                (s) => !uidsToDelete.includes(s.uid),
              )
            })
          }
        />
      </ControlContainer>

      {content instanceof TextContentModel && <TextControls />}
      {content instanceof ImageContentModel && <ImageControls />}

      <Button
        loading={deleting}
        color={COLOR.RED}
        loadingText="Deleting"
        onClick={() => setShowDeleteModal(true)}
        disabled={
          section.uid === article.titleSection.uid &&
          content.type === ContentType.TITLE
        }
        title={
          section.uid === article.titleSection.uid &&
          content.type === ContentType.TITLE
            ? "Title section can't be deleted"
            : null
        }
      >
        Delete
      </Button>

      {showDeleteModal && (
        <Modal
          dark
          style={{ position: 'absolute', bottom: '1rem', width: '90%' }}
          title="Confirm"
          message={`Are you sure you want to delete "${content.displayName}"?`}
          onOk={() => {
            setShowDeleteModal(false)
            setDeleting(true)
            SectionService.removeContent(content, section)
            setDeleting(false)
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </section>
  )
})
