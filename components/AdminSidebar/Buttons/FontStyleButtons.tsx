import React from 'react'
import './FontStyleButtons.module.scss'
import { Button } from '../../Button/Button'
import { COLOR } from '../../../styles/color'
import italicIcon from '../../../assets/icons/streamline-icon-social-media-facebook-1@140x140.svg'
import capsIcon from '../../../assets/icons/streamline-icon-caps@140x140.svg'

interface Props {
  italic: boolean
  uppercase: boolean
  emphasize: boolean
  onSelected: (v: 'italic' | 'uppercase' | 'emphasize') => any
}

export function FontStyleButtons(props: Props) {
  const { italic, uppercase, emphasize, onSelected } = props

  return (
    <div className="button-group control-buttons container font-style">
      <Button
        toggleable
        onClick={() => onSelected('italic')}
        selected={italic}
        className="control-button"
      >
        <img src={italicIcon} alt="Logotype" className="icon" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected('uppercase')}
        selected={uppercase}
        className="control-button"
      >
        <img src={capsIcon} alt="Logotype" className="icon" />
      </Button>

      <Button
        toggleable
        onClick={() => onSelected('emphasize')}
        selected={emphasize}
        className="emphasize control-button"
      >
        <span
          style={{
            color: emphasize ? COLOR.WHITE : COLOR.BLACK,
          }}
        >
          Emphasize
        </span>
      </Button>
    </div>
  )
}
