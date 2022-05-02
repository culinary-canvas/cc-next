import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAdmin } from '../../../../../../admin/Admin.context'
import { ImageContentModel } from '../../../../../models/ImageContent.model'
import { ImageFit } from '../../../../../models/ImageFit'
import { ColorPicker } from '../../shared/colorPicker/ColorPicker'
import { ControlContainer } from '../../shared/controlContainer/ControlContainer'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import s from './IssueControls.module.scss'

export const IssueControls = observer(() => {
  const admin = useAdmin()
  const content = admin.content as ImageContentModel

  return (
    <>
      <ControlContainer label="Style">
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
