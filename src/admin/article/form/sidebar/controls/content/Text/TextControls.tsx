import React from 'react'
import { observer } from 'mobx-react'
import { Select } from '../../../../../../../form/select/Select'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { FontStyleButtons } from '../../shared/fontStyle/FontStyleButtons'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import { ColorPicker } from '../../shared/colorPicker/ColorPicker'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { FONT } from '../../../../../../../styles/font'
import { TextContentModel } from '../../../../../../../article/content/text/TextContent.model'
import { runInAction } from 'mobx'

interface Props {
  content: TextContentModel
}

export const TextControls = observer((props: Props) => {
  const { content } = props

  return (
    <>
      <label htmlFor="fontFamily">Font family</label>
      <Select
        id="fontFamily"
        value={content.format.fontFamily}
        options={Object.values(FONT.FAMILY)}
        onChange={(v) => (content.format.fontFamily = v)}
      />

      <label htmlFor="fontSize">Font size</label>
      <Select
        id="fontSize"
        value={content.format.fontSize}
        options={Object.values(FONT.SIZE)}
        onChange={(v) => (content.format.fontSize = v)}
      />

      <label htmlFor="fontWeight">Font weight</label>
      <Select
        id="fontWeight"
        value={content.format.fontWeight}
        options={FONT.WEIGHT}
        onChange={(v) => (content.format.fontWeight = v)}
      />

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

      <div className="text-align-buttons">
        <HorizontalAlignButtons
          selected={content.format.horizontalAlign}
          onSelected={(v) => (content.format.horizontalAlign = v)}
        />

        <VerticalAlignButtons
          selected={content.format.verticalAlign}
          onSelected={(v) => (content.format.verticalAlign = v)}
        />
      </div>

      <label htmlFor="color">Color</label>
      <ColorPicker
        id="color"
        value={content.format.color}
        onSelect={(color) => runInAction(() => (content.format.color = color))}
      />

      <label htmlFor="text-padding">Padding</label>
      <PaddingControls
        padding={content.format.padding}
        onChange={(p) => (content.format.padding = p)}
      />
    </>
  )
})
