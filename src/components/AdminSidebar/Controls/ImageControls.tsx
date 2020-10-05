import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { ImageWithModal } from '../../ImageWithModal/ImageWithModal'
import { Slider } from '../../Slider/Slider'
import { PaddingInput } from '../Buttons/PaddingInput'
import { Checkbox } from '../../Checkbox/Checkbox'
import { HorizontalAlignButtons } from '../Buttons/HorizontalAlignButtons'
import { VerticalAlignButtons } from '../Buttons/VerticalAlignButtons'
import { useReaction } from '../../../hooks/useReaction'
import {useEnv} from '../../../services/AppEnvironment'
import {ImageContent} from '../../../domain/Image/ImageContent'
import {Fit} from '../../../domain/Section/Fit'

export const ImageControls = observer(() => {
  const env = useEnv()

  const content = env.adminSidebarStore.content as ImageContent

  const [useFixedSize, setUseFixedSize] = useState<boolean>(
    !!content?.format.size,
  )

  useReaction(
    () => env.adminSidebarStore.content.uid,
    () => {
      if (content) {
        console.log('reaction', env.adminSidebarStore.content?.format.size)
        setUseFixedSize(!!env.adminSidebarStore.content?.format.size)
      }
    },
  )

  return (
    <>
      {env.adminSidebarStore.section.format.fit === Fit.ARTICLE && (
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

      {env.adminSidebarStore.section.format.fit === Fit.ARTICLE && (
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
