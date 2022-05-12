import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { useAdmin } from '../../../../../admin/Admin.context'
import { classnames } from '../../../../../services/importHelpers'
import StringUtils from '../../../../../services/utils/StringUtils'
import { Button } from '../../../../../shared/button/Button'
import { Modal } from '../../../../../shared/modal/Modal'
import { Select } from '../../../../../shared/select/Select'
import { COLOR } from '../../../../../styles/_color'
import { ContentType } from '../../../../models/ContentType'
import { ImageContentModel } from '../../../../models/ImageContent.model'
import { IssueContentModel } from '../../../../models/IssueContent.model'
import { TextContentModel } from '../../../../models/TextContent.model'
import { SectionService } from '../../../../section/Section.service'
import { ContentService } from '../../../../services/Content.service'
import { ControlContainer } from '../shared/controlContainer/ControlContainer'
import { GridControl } from '../shared/gridControl/GridControl'
import s from './ContentControls.module.scss'
import { ImageControls } from './Image/ImageControls'
import { IssueControls } from './issue/IssueControls'
import { TextControls } from './Text/TextControls'

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
            console.log('HÄRÅ?')
            runInAction(() =>
              section.contents.splice(contentIndex, 1, appliedContent),
            )
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
      {content instanceof IssueContentModel && <IssueControls />}

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
