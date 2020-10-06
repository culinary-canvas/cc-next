import React from 'react'
import leftAlignIcon from '../../../../public/assets/icons/streamline-icon-paragraph-left-align-alternate@140x140.svg'
import pictureIcon from '../../../../public/assets/icons/streamline-icon-picture-landscape@140x140.svg'
import './OrientationButtons.module.scss'
import { Button } from '../../Button/Button'
import { Orientation } from '../../../domain/Section/Orientation'

interface Props {
  selected: Orientation
  onSelected: (v: Orientation) => any
  id: string
  disabled?: boolean
}

export function OrientationButtons(props: Props) {
  const { selected, onSelected, id, disabled = false } = props

  return (
    <div id={id} className="control-buttons container orientation">
      {[Orientation.VERTICAL, Orientation.HORIZONTAL].map((orientation) => (
        <Button
          key={orientation}
          toggleable
          onClick={() => onSelected(orientation)}
          selected={selected === orientation}
          className={`orientation-${orientation} control-button`}
          disabled={disabled}
        >
          <img src={leftAlignIcon} alt="Logotype" className="icon" />
          <img src={pictureIcon} alt="Logotype" className="icon" />
        </Button>
      ))}
    </div>
  )
}
