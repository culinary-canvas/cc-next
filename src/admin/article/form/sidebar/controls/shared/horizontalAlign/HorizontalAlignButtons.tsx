import React from 'react'
import leftAlignIcon from '../../../../../../../../public/assets/icons/streamline-icon-paragraph-left-align-alternate@140x140.svg'
import centerAlignIcon from '../../../../../../../../public/assets/icons/streamline-icon-paragraph-center-align-alternate@140x140.svg'
import rightAlignIcon from '../../../../../../../../public/assets/icons/streamline-icon-paragraph-right-align-alternate@140x140.svg'
import { Button } from '../../../../../../../form/button/Button'
import { HorizontalAlign } from '../../../../../../../article/shared/HorizontalAlign'
import s from './HorizontalAlignButtons.module.scss'

interface Props {
  selected: HorizontalAlign
  onSelected: (v: HorizontalAlign) => any
}

export function HorizontalAlignButtons(props: Props) {
  const { selected, onSelected } = props

  return (
    <div className={s.container}>
      <Button
        toggleable
        onClick={() => onSelected(HorizontalAlign.LEFT)}
        selected={selected === HorizontalAlign.LEFT}
        className={s.button}
      >
        <img src={leftAlignIcon} alt="Left align" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(HorizontalAlign.CENTER)}
        selected={selected === HorizontalAlign.CENTER}
        className={s.button}
      >
        <img src={centerAlignIcon} alt="Center align" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(HorizontalAlign.RIGHT)}
        selected={selected === HorizontalAlign.RIGHT}
        className={s.button}
      >
        <img src={rightAlignIcon} alt="Right align" />
      </Button>
    </div>
  )
}
