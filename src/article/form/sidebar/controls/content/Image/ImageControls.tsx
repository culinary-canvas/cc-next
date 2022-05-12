import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAdmin } from '../../../../../../admin/Admin.context'
import { ImageEdit } from '../../../../../../image/imageEdit/ImageEdit'
import { Checkbox } from '../../../../../../shared/checkbox/Checkbox'
import { ImageContentModel } from '../../../../../models/ImageContent.model'
import { ImageFit } from '../../../../../models/ImageFit'
import { CheckboxSliderControl } from '../../shared/checkboxSliderControl/CheckboxSliderControl'
import { ColorPicker } from '../../shared/colorPicker/ColorPicker'
import { ControlContainer } from '../../shared/controlContainer/ControlContainer'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { ImageFitButtons } from '../../shared/imageFItButtons/ImageFitButtons'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import s from './ImageControls.module.scss'

export const ImageControls = observer(() => {
  const admin = useAdmin()
  const content = admin.content as ImageContentModel

  return (
    <>
      <ControlContainer label="Image">
        <div className={s.imageEdit}>
          <ImageEdit
            set={content.set}
            format={content.format}
            onChange={(set) => runInAction(() => (content.set = set))}
          />
        </div>
        <label htmlFor="alt">Alt</label>
        <input
          id="alt"
          type="text"
          value={content.alt}
          onChange={(v) =>
            runInAction(() => (content.set.alt = v.target.value))
          }
          placeholder="Describe the image..."
        />
      </ControlContainer>

      <ControlContainer>
        <CheckboxSliderControl
          value={content.format.maxHeight}
          max={content.set?.height}
          onChange={(v) => runInAction(() => (content.format.maxHeight = v))}
          label="Max height"
        />
      </ControlContainer>

      <ControlContainer label="Style">
        <Checkbox
          label="Circle"
          checked={content.format.circle}
          onChange={(v) => runInAction(() => (content.format.circle = v))}
        />
        <ImageFitButtons
          selected={content.format.fit}
          onSelected={(fit) => runInAction(() => (content.format.fit = fit))}
        />
        <div className={s.row}>
          <HorizontalAlignButtons
            selected={content.format.horizontalAlign}
            onSelected={(v) =>
              runInAction(() => (content.format.horizontalAlign = v))
            }
          />
          {!content.format.circle && (
            <VerticalAlignButtons
              selected={content.format.verticalAlign}
              onSelected={(v) =>
                runInAction(() => (content.format.verticalAlign = v))
              }
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
          onChange={(p) => runInAction(() => (content.format.padding = p))}
        />
      </ControlContainer>
    </>
  )
})
