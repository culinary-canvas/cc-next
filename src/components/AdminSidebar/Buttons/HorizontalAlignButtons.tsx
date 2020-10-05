import React from 'react'
import leftAlignIcon from '../../../assets/icons/streamline-icon-paragraph-left-align-alternate@140x140.svg'
import centerAlignIcon from '../../../assets/icons/streamline-icon-paragraph-center-align-alternate@140x140.svg'
import rightAlignIcon from '../../../assets/icons/streamline-icon-paragraph-right-align-alternate@140x140.svg'
import { Button } from '../../Button/Button'
import { HorizontalAlign } from '../../../domain/Text/HorizontalAlign'

interface Props {
  selected: HorizontalAlign
  onSelected: (v: HorizontalAlign) => any
}

export function HorizontalAlignButtons(props: Props) {
  const { selected, onSelected } = props

  return (
    <div className="button-group control-buttons container">
      <Button
        toggleable
        onClick={() => onSelected(HorizontalAlign.LEFT)}
        selected={selected === HorizontalAlign.LEFT}
        className="control-button"
      >
        <img src={leftAlignIcon} alt="Logotype" className="icon" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(HorizontalAlign.CENTER)}
        selected={selected === HorizontalAlign.CENTER}
        className="control-button"
      >
        <img src={centerAlignIcon} alt="Logotype" className="icon" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(HorizontalAlign.RIGHT)}
        selected={selected === HorizontalAlign.RIGHT}
        className="control-button"
      >
        <img src={rightAlignIcon} alt="Logotype" className="icon" />
      </Button>
    </div>
  )
}
