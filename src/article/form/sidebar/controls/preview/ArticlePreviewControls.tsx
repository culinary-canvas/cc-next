import React from 'react'
import { observer } from 'mobx-react'
import { useAdmin } from '../../../../../admin/Admin.context'
import s from './ArticlePreviewControls.module.scss'
import { Checkbox } from '../../../../../shared/checkbox/Checkbox'
import { ControlContainer } from '../shared/controlContainer/ControlContainer'
import { runInAction } from 'mobx'
import { ImageEdit } from '../../../../../image/imageEdit/ImageEdit'
import { VerticalAlignButtons } from '../shared/verticalAlign/VerticalAlignButtons'

export const ArticlePreviewControls = observer(() => {
  const admin = useAdmin()
  const { preview } = admin.article

  return (
    <div className={s.controls}>
      <ControlContainer label="Title" id="title">
        <Checkbox
          checked={!!preview.useArticleImage}
          onChange={() => (preview.useArticleImage = !preview.useArticleImage)}
          label="Use article image"
        />

        <div className={s.imageEdit}>
          <ImageEdit
            set={preview.image}
            format={preview.imageFormat}
            onChange={(set) => runInAction(() => (preview.image = set))}
            disabled={preview.useArticleImage}
          />
        </div>

        <VerticalAlignButtons
          selected={preview.imageFormat.verticalAlign}
          onSelected={(v) => (preview.imageFormat.verticalAlign = v)}
        />

        <label htmlFor="preview-alt">Alt</label>
        <input
          id="preview-alt"
          type="text"
          value={preview.alt}
          onChange={(v) => runInAction(() => (preview.alt = v.target.value))}
          placeholder="Describe the image..."
          disabled={preview.useArticleImage}
        />
      </ControlContainer>

      <ControlContainer label="Title" id="title">
        <Checkbox
          checked={!!preview.useArticleTitle}
          onChange={() => (preview.useArticleTitle = !preview.useArticleTitle)}
          label="Use article Title"
        />

        <input
          disabled={preview.useArticleTitle}
          type="text"
          placeholder="Title in preview"
          value={preview.title}
          onChange={(event) =>
            runInAction(() => (preview.title = event.target.value))
          }
        />
      </ControlContainer>

      <ControlContainer label="Text" id="text">
        <Checkbox
          checked={!!preview.useArticleText}
          onChange={() => (preview.useArticleText = !preview.useArticleText)}
          label="Use article sub heading"
        />

        <input
          disabled={preview.useArticleText}
          type="text"
          placeholder="Text in preview"
          value={preview.text}
          onChange={(event) =>
            runInAction(() => (preview.text = event.target.value))
          }
        />
      </ControlContainer>
    </div>
  )
})
