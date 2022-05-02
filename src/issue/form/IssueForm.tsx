import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { TextEditMenu } from '../../article/form/text/TextEditMenu'
import { ImageFormat } from '../../article/models/ImageFormat'
import { IssueModel } from '../models/Issue.model'
import { ImageEdit } from '../../image/imageEdit/ImageEdit'
import { ImageSet } from '../../image/models/ImageSet'
import { useAuth } from '../../services/auth/Auth'
import { useFormControl } from '../../services/formControl/useFormControl'
import { Button } from '../../shared/button/Button'
import { DatePicker } from '../../shared/datePIcker/DatePicker'
import { useErrorModal } from '../../shared/error/useErrorModal'
import { OverlayConfirm } from '../../shared/overlay/OverlayConfirm'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { IssueApi } from '../Issue.api'
import s from './IssueForm.module.scss'

interface Props {
  issue: IssueModel
}

export const IssueForm = observer((props: Props) => {
  const { issue: _issue } = props
  const { userId } = useAuth()
  const overlay = useOverlay()
  const router = useRouter()
  const auth = useAuth()
  const { showError } = useErrorModal()
  const [formControl, issue] = useFormControl(_issue, [
    { field: 'name', required: true },
    { field: 'publishMonth', required: true },
  ])

  const textareaRef = useRef<HTMLTextAreaElement>()

  const [loading, setLoading] = useState<boolean>(false)
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  })

  if (!formControl) {
    return null
  }

  console.log(
    formControl.isValid,
    formControl.errors,
    formControl.errorFields,
    loading,
    formControl.isClean,
    issue.publishMonth,
  )

  return (
    <article className={s.container}>
      <div className={s.buttonsContainer}>
        <Button
          disabled={formControl.isClean || !formControl.isValid || loading}
          onClick={async () => {
            try {
              setLoading(true)
              overlay.toggle()
              const id = await IssueApi.save(issue, userId, (v, t) =>
                overlay.setProgress(v, t),
              )
              setTimeout(() => overlay.toggle(false), 1000)
              router.replace(
                !!router.query.id ? `/admin/issues` : `/admin/issues/${id}`,
              )
            } catch (e) {
              showError(e)
              console.error(e)
            } finally {
              setLoading(false)
            }
          }}
        >
          Save
        </Button>
        <Button
          onClick={async () => {
            if (formControl.isDirty) {
              overlay.setChildren(
                <OverlayConfirm
                  title="Are you sure?"
                  message={`You have unsaved changes. Are you sure you want to leave this page?`}
                  onOk={() => router.back()}
                />,
              )
              overlay.toggle()
            } else {
              router.back()
            }
          }}
        >
          {formControl.isDirty ? 'Cancel' : 'Back'}
        </Button>
      </div>

      <label htmlFor="name">Name*</label>
      <input
        type="text"
        id="name"
        value={issue.name}
        onFocus={(e) => e.target.select()}
        onChange={(e) =>
          runInAction(() => (formControl.mutable.name = e.target.value))
        }
      />

      <label htmlFor="publishMonth">Publish month</label>
      <DatePicker
        id="publishMonth"
        selected={issue.publishMonth}
        onChange={(v) =>
          runInAction(() => (formControl.mutable.publishMonth = v))
        }
        containerClassName={s.buttonsContainer}
        className={s.datePicker}
        showTimeSelect={false}
        showMonthYearPicker
        dateFormat={'MMMM yyyy'}
      />

      <label htmlFor="description" style={{ marginTop: '3rem' }}>
        Description
      </label>
      <TextEditMenu
        text={issue.description}
        selectionStart={selection.start}
        selectionEnd={selection.end}
        onTextChange={(text) =>
          runInAction(() => (formControl.mutable.description = text))
        }
      />
      <TextareaAutosize
        ref={textareaRef}
        id="description"
        onChange={(e) =>
          runInAction(() => (issue.description = e.target.value))
        }
        value={issue.description}
        placeholder="Write a short description"
        onBlur={(e) => {
          e.target.setSelectionRange(selection.start, selection.end)
        }}
        onMouseUp={() =>
          setSelection({
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          })
        }
        onKeyUp={() =>
          setSelection({
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          })
        }
      />

      <label htmlFor="image" style={{ marginBottom: '1rem' }}>
        Image
      </label>
      <ImageEdit
        set={issue.imageSet}
        format={issue.imageFormat}
        onFocus={() => {
          issue.imageSet = new ImageSet()
          issue.imageFormat = new ImageFormat()
        }}
        onChange={(imageSet) => runInAction(() => (issue.imageSet = imageSet))}
      />
    </article>
  )
})
