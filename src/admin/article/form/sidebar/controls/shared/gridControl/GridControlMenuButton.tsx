import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import s from './GridControlMenuButton.module.scss'
import { classnames } from '../../../../../../../services/importHelpers'
import { Button } from '../../../../../../../form/button/Button'
import { v4 as uuid } from 'uuid'

interface Props {
  disabled?: boolean
  hovered: string
  onHover: (id: string) => void
  onBlur: () => void
  onClick: () => void
  children: any
}

export const GridControlMenuButton = observer((props: Props) => {
  const {
    disabled = false,
    hovered,
    onHover,
    onBlur,
    onClick,
    children,
  } = props
  const id = useRef(uuid()).current

  return (
    <div className={s.buttonWrapper}>
      <label htmlFor={id} className={classnames({ [s.disabled]: disabled })}>
        Bring back
      </label>
      <Button
        id={id}
        className={classnames(s.button, {
          [s.hoveringOther]: !!hovered && hovered !== id,
        })}
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onBlur()}
        onClick={() => onClick()}
        disabled={disabled}
      >
        {children}
      </Button>
    </div>
  )
})
