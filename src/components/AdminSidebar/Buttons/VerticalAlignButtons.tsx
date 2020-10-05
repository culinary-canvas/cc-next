import React from 'react'
import './VerticalAlignButtons.module.scss'
import { Button } from '../../Button/Button'
import { VerticalAlign } from '../../../domain/Text/VerticalAlign'
import { FONT } from '../../../styles/font'
import { COLOR } from '../../../styles/color'
import leftAlignIcon from '../../../assets/icons/streamline-icon-paragraph-left-align-alternate@140x140.svg'

interface Props {
  selected: VerticalAlign
  onSelected: (v: VerticalAlign) => any
}

export function VerticalAlignButtons(props: Props) {
  const { selected, onSelected } = props

  return (
    <div className="button-group control-buttons container vertical-align">
      <Button
        toggleable
        onClick={() => onSelected(VerticalAlign.TOP)}
        selected={selected === VerticalAlign.TOP}
        className="control-button"
      >
        <img
          src={leftAlignIcon}
          alt="Logotype"
          className="icon"
          style={{ fill: VerticalAlign.TOP ? COLOR.WHITE : COLOR.BLACK }}
        />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(VerticalAlign.CENTER)}
        selected={selected === VerticalAlign.CENTER}
        className="control-button"
      >
        <img
          src={leftAlignIcon}
          alt="Logotype"
          className="icon"
          style={{ fill: VerticalAlign.TOP ? COLOR.WHITE : COLOR.BLACK }}
        />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(VerticalAlign.BOTTOM)}
        selected={selected === VerticalAlign.BOTTOM}
        className="control-button"
      >
        <img
          src={leftAlignIcon}
          alt="bottom"
          className="icon"
          style={{ fill: VerticalAlign.TOP ? COLOR.WHITE : COLOR.BLACK }}
        />
      </Button>
    </div>
  )
}
