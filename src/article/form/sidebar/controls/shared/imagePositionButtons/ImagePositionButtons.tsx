import React from 'react'
import { Button } from '../../../../../../shared/button/Button'
import s from './ImagePositionButtons.module.scss'
import { ImageFit } from '../../../../../models/ImageFit'

interface Props {
  selected: ImageFit
  onSelected: (v: ImageFit) => any
}

export function ImagePositionButtons(props: Props) {
  const { selected, onSelected } = props

  return (
    <>
      <label htmlFor="image-fit">Fit</label>
      <div id="image-fit" className={s.container}>
        <Button
          toggleable
          onClick={() => onSelected(ImageFit.COVER)}
          selected={selected === ImageFit.COVER}
          className={s.button}
          title="Image will overflow to fill the content area"
        >
          Fill
        </Button>

        <Button
          toggleable
          onClick={() => onSelected(ImageFit.CONTAIN)}
          selected={selected === ImageFit.CONTAIN}
          className={s.button}
          title="Image will shrink to ensure it fits inside the content area. Note! This means the size will vary on different screen sizes."
        >
          Self
        </Button>
      </div>
    </>
  )
}
