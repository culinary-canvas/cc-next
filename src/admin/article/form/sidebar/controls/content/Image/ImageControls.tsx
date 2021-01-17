import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { Checkbox } from '../../../../../../../form/checkbox/Checkbox'
import { ImageContentModel } from '../../../../../../../article/content/image/ImageContent.model'
import { runInAction } from 'mobx'
import { useReaction } from '../../../../../../../hooks/useReaction'
import s from './ImageControls.module.scss'
import { ImageFitButtons } from '../../shared/imageFItButtons/ImageFitButtons'
import { useAdmin } from '../../../../../../Admin'
import { ImageEdit } from '../../../../../../../form/imageEdit/ImageEdit'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import { CheckboxSliderControl } from '../../shared/checkboxSliderControl/CheckboxSliderControl'
import { ControlContainer } from '../../shared/controlContainer/ControlContainer'
import { ColorPicker } from '../../shared/colorPicker/ColorPicker'
import { ImageFit } from '../../../../../../../article/content/image/ImageFit'

export const ImageControls = observer(() => {
  const admin = useAdmin()
  const content = admin.content as ImageContentModel
  const [alt, setAlt] = useState<string>(content.set.alt)

  useEffect(() => {
    if (content.alt !== alt) {
      runInAction(() => (content.set.alt = alt))
    }
  }, [alt])

  useReaction(
    () => content.set.alt,
    (t) => setAlt(t),
  )

  return (
    <>
      <ControlContainer label="Image">
        <div className={s.imageEdit}>
          <ImageEdit
            set={content.set}
            format={content.format}
            onChange={(set) => (content.set = set)}
          />
        </div>
        <label htmlFor="alt">Alt</label>
        <input
          id="alt"
          type="text"
          value={alt}
          onChange={(v) => setAlt(v.target.value)}
          placeholder="Describe the image..."
        />
      </ControlContainer>

      <ControlContainer>
        <CheckboxSliderControl
          value={content.format.maxHeight}
          max={content.set.cropped?.height}
          onChange={(v) => runInAction(() => (content.format.maxHeight = v))}
          label="Max height"
        />
      </ControlContainer>

      <ControlContainer label="Style">
        <Checkbox
          label="Circle"
          checked={content.format.circle}
          onChange={(v) => (content.format.circle = v)}
        />
        <ImageFitButtons
          selected={content.format.fit}
          onSelected={(fit) => runInAction(() => (content.format.fit = fit))}
        />
        <div className={s.row}>
          <HorizontalAlignButtons
            selected={content.format.horizontalAlign}
            onSelected={(v) => (content.format.horizontalAlign = v)}
          />
          {!content.format.circle && (
            <VerticalAlignButtons
              selected={content.format.verticalAlign}
              onSelected={(v) => (content.format.verticalAlign = v)}
            />
          )}
        </div>
        {(content.format.circle || content.format.fit !== ImageFit.COVER) && (
          <ColorPicker
            id="content-background-color"
            value={content.format.backgroundColor}
            onSelect={(c) =>
              runInAction(() => (content.format.backgroundColor = c))
            }
            additionalColors={admin.article.colors}
            showTransparent
          />
        )}
      </ControlContainer>

      <ControlContainer label="Padding">
        <PaddingControls
          padding={content.format.padding}
          onChange={(p) => (content.format.padding = p)}
        />
      </ControlContainer>
    </>
  )
})
