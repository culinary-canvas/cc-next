import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { ImageEdit } from '../../../../../../../form/imageEdit/ImageEdit'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { Checkbox } from '../../../../../../../form/checkbox/Checkbox'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import { ImageContentModel } from '../../../../../../../article/content/image/ImageContent.model'
import { Fit } from '../../../../../../../article/shared/Fit'
import { SectionModel } from '../../../../../../../article/section/Section.model'
import { Slider } from '../../../../../../../form/slider/Slider'
import { runInAction } from 'mobx'
import { useReaction } from '../../../../../../../hooks/useReaction'

interface Props {
  content: ImageContentModel
  section: SectionModel
}

export const ImageControls = observer((props: Props) => {
  const { content, section } = props
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

      <ImageEdit
        set={content.set}
        onChange={(set) => (content.set = set)}
      />

      <input
        id="alt"
        type="text"
        value={alt}
        onChange={(v) => setAlt(v.target.value)}
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
      <PaddingControls
        padding={content.format.padding}
        onChange={(p) => (content.format.padding = p)}
      />
    </>
  )
})
