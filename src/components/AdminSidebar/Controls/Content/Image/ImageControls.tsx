import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { ImageWithModal } from '../../../../ImageWithModal/ImageWithModal'
import { PaddingInput } from '../../Elements/PaddingInput/PaddingInput'
import { Checkbox } from '../../../../Checkbox/Checkbox'
import { HorizontalAlignButtons } from '../../Elements/HorizontalAlignButtons/HorizontalAlignButtons'
import { VerticalAlignButtons } from '../../Elements/VerticalAlignButtons/VerticalAlignButtons'
import { useEnv } from '../../../../../services/AppEnvironment'
import { ImageContent } from '../../../../../domain/Image/ImageContent'
import { Fit } from '../../../../../domain/Section/Fit'
import { Section } from '../../../../../domain/Section/Section'
import {Slider} from '../../../../Slider/Slider'

interface Props {
  content: ImageContent
  section: Section
}

export const ImageControls = observer((props: Props) => {
  const { content, section } = props
  const env = useEnv()

  const [useFixedSize, setUseFixedSize] = useState<boolean>(
    !!content?.format.size,
  )

  useEffect(() => {
    if (!!content?.uid) {
      setUseFixedSize(!!content.format.size)
    }
  }, [content.uid])

  return (
    <>
      {section.format.fit === Fit.ARTICLE && (
        <div className="text-align-buttons margin-top-1">
          <HorizontalAlignButtons
            selected={content.format.horizontalAlign}
            onSelected={(v) => (content.format.horizontalAlign = v)}
          />

          <VerticalAlignButtons
            selected={content.format.verticalAlign}
            onSelected={(v) => (content.format.verticalAlign = v)}
          />
        </div>
      )}

      <Checkbox
        label="Background"
        checked={content.format.background}
        onChange={(v) => (content.format.background = v)}
      />

      <ImageWithModal
        set={content.set}
        onChange={(set) => (content.set = set)}
      />

      <input
        id="alt"
        type="text"
        value={content.set.alt}
        onChange={(v) => (content.set.alt = v.target.value)}
        placeholder="Describe the image..."
      />

      {section.format.fit === Fit.ARTICLE && (
        <span className="fixed-size-container">
          <Checkbox
            containerClassName="fixed-size-checkbox"
            checked={useFixedSize}
            onChange={(v) => {
              setUseFixedSize(v)
              if (v) {
                content.format.size = 100
              } else {
                content.format.size = null
              }
            }}
            label="Fixed size"
          />
          <Slider
            containerClassName="fixed-size-slider"
            value={content.format.size}
            min={1}
            max={100}
            onChange={(v) => (content.format.size = v)}
            disabled={!useFixedSize}
          />
        </span>
      )}
      <PaddingInput
        padding={content.format.padding}
        onChange={(p) => (content.format.padding = p)}
      />
    </>
  )
})
