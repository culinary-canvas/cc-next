import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { ImageEdit } from '../../../../../../../form/imageEdit/ImageEdit'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { Checkbox } from '../../../../../../../form/checkbox/Checkbox'
import { ImageContentModel } from '../../../../../../../article/content/image/ImageContent.model'
import { runInAction } from 'mobx'
import { useReaction } from '../../../../../../../hooks/useReaction'
import s from './ImageControls.module.scss'
import { FixedSizeControls } from '../../shared/fixedSize/FixedSizeControls'
import { ImageFitButtons } from '../../shared/imageFItButtons/ImageFitButtons'
import { useAdmin } from '../../../../../../Admin'

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
      <ImageEdit set={content.set} onChange={(set) => (content.set = set)} />

      <input
        id="alt"
        type="text"
        value={alt}
        onChange={(v) => setAlt(v.target.value)}
        placeholder="Describe the image..."
      />

      <Checkbox
        label="Circle"
        checked={content.format.circle}
        onChange={(v) => (content.format.circle = v)}
      />

      <ImageFitButtons
        selected={content.format.fit}
        onSelected={(fit) => runInAction(() => (content.format.fit = fit))}
      />

      <FixedSizeControls content={content} />

      <label className={s.label}>Padding</label>
      <PaddingControls
        padding={content.format.padding}
        onChange={(p) => (content.format.padding = p)}
      />
    </>
  )
})
