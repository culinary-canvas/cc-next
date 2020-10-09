import React from 'react'
import leftAlignIcon from '../../../../../../public/assets/icons/streamline-icon-paragraph-left-align-alternate@140x140.svg'
import pictureIcon from '../../../../../../public/assets/icons/streamline-icon-picture-landscape@140x140.svg'
import { Button } from '../../../../Button/Button'
import { Orientation } from '../../../../../domain/Section/Orientation'
import s from './AlignToPreviousButtons.module.scss'
import { classnames } from '../../../../../services/importHelpers'

interface Props {
  selected: Orientation
  onSelected: (v: Orientation) => any
  id: string
  disabled?: boolean
}

export function AlignToPreviousButtons(props: Props) {
  const { selected, onSelected, id, disabled = false } = props

  return (
    <div id={id} className={s.container}>
      {[Orientation.VERTICAL, Orientation.HORIZONTAL].map((orientation) => (
        <Button
          key={orientation}
          toggleable
          onClick={() => onSelected(orientation)}
          selected={selected === orientation}
          className={classnames(s[`orientation-${orientation}`], s.button)}
          disabled={disabled}
        >
          <img src={leftAlignIcon} alt="Logotype" />
          <img src={pictureIcon} alt="Logotype" />
        </Button>
      ))}
    </div>
  )
}
