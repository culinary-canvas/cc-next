import React from 'react'
import { observer } from 'mobx-react'
import { Select } from '../../../../../../../form/select/Select'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { FontStyleButtons } from '../../shared/fontStyle/FontStyleButtons'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import { ColorPicker } from '../../shared/colorPicker/ColorPicker'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { FONT } from '../../../../../../../styles/font'
import { runInAction } from 'mobx'
import { useAdmin } from '../../../../../../Admin'
import { TextContentModel } from '../../../../../../../article/content/text/TextContent.model'
import { ControlContainer } from '../../shared/controlContainer/ControlContainer'
import s from './TextControls.module.scss'

export const TextControls = observer(() => {
  const admin = useAdmin()
  const content = admin.content as TextContentModel

  return (
    <>
      <ControlContainer id="font" label="Font">
        <div className={s.fontProperties}>
          <Select
            id="fontFamily"
            value={content.format.fontFamily}
            options={Object.values(FONT.FAMILY)}
            onChange={(v) => (content.format.fontFamily = v)}
          />
          <Select
            id="fontSize"
            value={content.format.fontSize}
            options={Object.values(FONT.SIZE)}
            onChange={(v) => (content.format.fontSize = v)}
            className={s.fontProperty}
          />
          <Select
            id="fontWeight"
            value={content.format.fontWeight}
            options={FONT.WEIGHT}
            onChange={(v) => (content.format.fontWeight = v)}
            className={s.fontProperty}
          />
        </div>
        <div className={s.fontProperties}>
          <FontStyleButtons
            emphasize={content.format.emphasize}
            italic={content.format.italic}
            uppercase={content.format.uppercase}
            onSelected={(v) => {
              switch (v) {
                case 'emphasize':
                  content.format.emphasize = !content.format.emphasize
                  break
                case 'italic':
                  content.format.italic = !content.format.italic
                  break
                case 'uppercase':
                  content.format.uppercase = !content.format.uppercase
              }
            }}
          />
          <ColorPicker
            background
            small
            id="color"
            value={content.format.color}
            onSelect={(color) =>
              runInAction(() => (content.format.color = color))
            }
            additionalColors={admin.article.colors}
          />
        </div>

        <div className={s.fontProperties}>
          <HorizontalAlignButtons
            selected={content.format.horizontalAlign}
            onSelected={(v) => (content.format.horizontalAlign = v)}
          />

          <VerticalAlignButtons
            selected={content.format.verticalAlign}
            onSelected={(v) => (content.format.verticalAlign = v)}
          />
        </div>
      </ControlContainer>

      <ControlContainer id="text-padding" label="Padding">
        <PaddingControls
          padding={content.format.padding}
          onChange={(p) => (content.format.padding = p)}
        />
      </ControlContainer>
    </>
  )
})
