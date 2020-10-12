import React from 'react'
import pictureIcon from '../../../../../../../../public/assets/icons/streamline-icon-picture-landscape@140x140.svg'
import { Button } from '../../../../../../../form/button/Button'
import { SectionPreset } from '../../../../../../../article/section/SectionPreset'
import { classnames } from '../../../../../../../services/importHelpers'
import s from './SectionPresetButtons.module.scss'
import StringUtils from '../../../../../../../services/utils/StringUtils'

interface Props {
  selected: SectionPreset
  onSelected: (v: SectionPreset) => any
  id: string
  disabled?: boolean
}

export function SectionPresetButtons(props: Props) {
  const { selected, onSelected, id, disabled = false } = props

  return (
    <div id={id} className={s.container}>
      {Object.values(SectionPreset).map((preset) => (
        <Button
          key={preset}
          toggleable
          onClick={() => onSelected(preset)}
          selected={selected === preset}
          className={classnames(s[`section-preset-${preset}`], s.button)}
          disabled={disabled}
        >
          <img
            src={pictureIcon}
            alt={`Section preset: ${StringUtils.toDisplayText(preset)}`}
            style={{ width: getImageSize(preset) }}
            className={classnames(s.image, s[`section-preset-${preset}`])}
          />
          <span className={classnames(s.texts, s[`section-preset-${preset}`])}>
            <span
              className={classnames(s.text, s[`section-preset-${preset}`])}
            />
            <span
              className={classnames(s.text, s[`section-preset-${preset}`])}
            />
            <span
              className={classnames(s.text, s[`section-preset-${preset}`])}
            />
          </span>
        </Button>
      ))}
    </div>
  )

  function getImageSize(preset: SectionPreset) {
    switch (preset) {
      case SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE:
        return '64px'
      case SectionPreset.FULL_SCREEN_IMAGE_TITLE_SUB_BYLINE:
        return '52px'
      case SectionPreset.INLINE_IMAGE_TITLE_SUB_BYLINE:
        return '48px'
    }
  }
}
