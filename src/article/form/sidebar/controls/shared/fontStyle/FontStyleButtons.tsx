import React from 'react'
import s from './FontStyleButtons.module.scss'
import { Button } from '../../../../../../shared/button/Button'
import { COLOR } from '../../../../../../styles/_color'
import italicIcon from '../../../../../../../public/assets/icons/streamline-icon-text-italic@140x140.svg'
import capsIcon from '../../../../../../../public/assets/icons/streamline-icon-caps@140x140.svg'
import { classnames } from '../../../../../../services/importHelpers'

interface Props {
  italic: boolean
  uppercase: boolean
  emphasize: boolean
  onSelected: (v: 'italic' | 'uppercase' | 'emphasize') => any
}

export function FontStyleButtons(props: Props) {
  const { italic, uppercase, emphasize, onSelected } = props

  return (
    <div className={s.container}>
      <Button
        toggleable
        onClick={() => onSelected('italic')}
        selected={italic}
        className={s.button}
      >
        <img src={italicIcon} alt="Italic" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected('uppercase')}
        selected={uppercase}
        className={s.button}
      >
        <img src={capsIcon} alt="Uppercase" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected('emphasize')}
        selected={emphasize}
        className={classnames(s.button, s.emphasize)}
      >
        <span
          style={{
            color: emphasize ? COLOR.WHITE : COLOR.BLACK,
            padding: 0,
          }}
        >
          Emphasize
        </span>
      </Button>
    </div>
  )
}
