import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Slider } from '../../../../../../../form/slider/Slider'
import { ImageContentModel } from '../../../../../../../article/content/image/ImageContent.model'
import { Checkbox } from '../../../../../../../form/checkbox/Checkbox'
import { useAutorun } from '../../../../../../../hooks/useAutorun'
import { LinkedButton } from '../linkedButton/LinkedButton'
import s from './FixedSizeControls.module.scss'

interface Props {
  content: ImageContentModel
}

export const FixedSizeControls = observer((props: Props) => {
  const { content } = props
  const [useFixedSize, setUseFixedSize] = useState<boolean>(
    !!content?.format.fixedWidth,
  )
  const [linked, setLinked] = useState<boolean>(true)

  useAutorun(() => {
    if (!!content?.uid && content.hasImage) {
      setUseFixedSize(!!content.format.fixedWidth)
    }
  }, [content.uid])

  useEffect(() => {
    if (useFixedSize) {
      setLinked(
        Math.round(
          100 * (content.set.cropped.width / content.set.cropped.height),
        ) ===
          Math.round(
            100 * (content.format.fixedWidth / content.format.fixedHeight),
          ),
      )
    }
  }, [content.uid, useFixedSize])

  useEffect(() => {
    if (useFixedSize && linked) {
      const widthPercent = content.format.fixedWidth / content.set.cropped.width
      const heightPercent =
        content.format.fixedHeight / content.set.cropped.height
      if (widthPercent > heightPercent) {
        content.format.fixedHeight = content.set.cropped.height * widthPercent
      } else {
        content.format.fixedWidth = content.set.cropped.width * heightPercent
      }
    }
  }, [useFixedSize, linked])

  return (
    <span className={s.container}>
      <span>
        <Checkbox
          checked={useFixedSize}
          onChange={(v) => {
            setUseFixedSize(v)
            if (v) {
              content.format.fixedWidth = content.set.cropped.width
              content.format.fixedHeight = content.set.cropped.height
            } else {
              content.format.fixedWidth = null
              content.format.fixedHeight = null
            }
          }}
          label="Fixed size"
        />
        <Slider
          value={content.format.fixedWidth}
          min={0}
          max={content.set.cropped?.width || 0}
          onChange={(v) => {
            const widthPercent = v / content.set.cropped.width
            content.format.fixedWidth = v
            if (linked) {
              content.format.fixedHeight = Math.round(
                content.set.cropped.height * widthPercent,
              )
            }
          }}
          disabled={!useFixedSize}
          label="Width"
        />
        <Slider
          value={content.format.fixedHeight}
          min={0}
          max={content.set.cropped?.height || 0}
          onChange={(v) => {
            const heightPercent = v / content.set.cropped.height
            content.format.fixedHeight = v
            if (linked) {
              content.format.fixedWidth = Math.round(
                content.set.cropped.width * heightPercent,
              )
            }
          }}
          disabled={!useFixedSize}
          label="Height"
        />
      </span>
      <span>
        <LinkedButton linked={linked} onClick={(v) => setLinked(v)} />
      </span>
    </span>
  )
})
