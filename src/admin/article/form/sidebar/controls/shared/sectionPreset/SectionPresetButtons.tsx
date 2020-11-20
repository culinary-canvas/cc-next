import React from 'react'
import { Button } from '../../../../../../../form/button/Button'
import { SectionPreset } from '../../../../../../../article/section/SectionPreset'
import { classnames } from '../../../../../../../services/importHelpers'
import s from './SectionPresetButtons.module.scss'
import StringUtils from '../../../../../../../services/utils/StringUtils'
import { SectionModel } from '../../../../../../../article/section/Section.model'

interface Props {
  section: SectionModel
  onSelected: (v: SectionPreset) => any
  id: string
  disabled?: boolean
}

export function SectionPresetButtons(props: Props) {
  const { section, onSelected, id, disabled = false } = props
  const selected = section.preset

  let titlePresets = [
    SectionPreset.FULL_SCREEN_TITLE,
    SectionPreset.HALF_SCREEN_TITLE,
    SectionPreset.INLINE_TITLE,
  ]
  return (
    <div id={id} className={s.container}>
      {Object.values(SectionPreset)
        .filter(
          (p) =>
            (section.format.gridPosition.startRow === 1 && titlePresets.includes(p)) ||
            (section.format.gridPosition.startRow !== 1 && !titlePresets.includes(p)),
        )
        .map((preset) => (
          <Button
            id={preset}
            key={preset}
            title={StringUtils.toDisplayText(preset)}
            toggleable
            onClick={() => onSelected(preset)}
            selected={selected === preset}
            className={classnames(s[`section-preset-${preset}`], s.button)}
            disabled={disabled}
          >
            {StringUtils.toDisplayText(preset)}
          </Button>
        ))}
    </div>
  )
}
