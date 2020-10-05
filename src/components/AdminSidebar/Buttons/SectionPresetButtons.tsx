import React from 'react'
import pictureIcon from '../../../assets/icons/streamline-icon-picture-landscape@140x140.svg'

import './SectionPresetButtons.module.scss'
import { Button } from '../../Button/Button'
import { SectionPreset } from '../../../domain/Section/SectionPreset'

interface Props {
  selected: SectionPreset
  onSelected: (v: SectionPreset) => any
  id: string
  disabled?: boolean
}

export function SectionPresetButtons(props: Props) {
  const { selected, onSelected, id, disabled = false } = props

  return (
    <div id={id} className="control-buttons container section-preset">
      {Object.values(SectionPreset).map((preset) => (
        <Button
          key={preset}
          toggleable
          onClick={() => onSelected(preset)}
          selected={selected === preset}
          className={`section-preset-${preset} control-button`}
          disabled={disabled}
        >
          <img
            src={pictureIcon}
            alt="Logotype"
            className="icon"
            width={getImageSize(preset)}
          />
          <span className="texts">
            <span className="text" />
            <span className="text" />
            <span className="text" />
          </span>
        </Button>
      ))}
    </div>
  )

  function getImageSize(preset: SectionPreset) {
    switch (preset) {
      case SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE:
        return 64
      case SectionPreset.FULL_SCREEN_IMAGE_TITLE_SUB_BYLINE:
        return 52
      case SectionPreset.INLINE_IMAGE_TITLE_SUB_BYLINE:
        return 48
    }
  }
}
