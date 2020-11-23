import React from 'react'
import s from './VerticalAlignButtons.module.scss'
import { Button } from '../../../../../../../form/button/Button'
import { VerticalAlign } from '../../../../../../../article/shared/VerticalAlign'
import { COLOR } from '../../../../../../../styles/color'
import UpIcon from '../../../../../../../../public/assets/icons/streamline-icon-move-up-1@140x140.svg'
import DownIcon from '../../../../../../../../public/assets/icons/streamline-icon-move-down-1@140x140.svg'
import CenterIcon from '../../../../../../../../public/assets/icons/streamline-icon-shrink-vertical-1@140x140.svg'

interface Props {
  selected: VerticalAlign
  onSelected: (v: VerticalAlign) => any
}

export function VerticalAlignButtons(props: Props) {
  const { selected, onSelected } = props

  return (
    <div className={s.container}>
      <Button
        toggleable
        onClick={() => onSelected(VerticalAlign.TOP)}
        selected={selected === VerticalAlign.TOP}
        className={s.button}
      >
        <img
          src={UpIcon}
          alt="Top align"
          style={{ fill: VerticalAlign.TOP ? COLOR.WHITE : COLOR.BLACK }}
        />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(VerticalAlign.CENTER)}
        selected={selected === VerticalAlign.CENTER}
        className={s.button}
      >
        <img
          src={CenterIcon}
          alt="Center align"
          style={{ fill: VerticalAlign.TOP ? COLOR.WHITE : COLOR.BLACK }}
        />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected(VerticalAlign.BOTTOM)}
        selected={selected === VerticalAlign.BOTTOM}
        className={s.button}
      >
        <img
          src={DownIcon}
          alt="Bottom align"
          style={{ fill: VerticalAlign.TOP ? COLOR.WHITE : COLOR.BLACK }}
        />
      </Button>
    </div>
  )
}
