import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import s from './GridControlMenuButton.module.scss'
import { classnames } from '../../../../../../services/importHelpers'
import { Button } from '../../../../../../shared/button/Button'
import { v4 as uuid } from 'uuid'

interface Props {
  disabled?: boolean
  onClick: () => void
  label: string
  children: any
}

export const GridControlMenuButton = observer((props: Props) => {
  const { disabled = false, onClick, label, children } = props
  const id = useRef(uuid()).current

  return (
    <div className={s.buttonWrapper}>
      <label
        htmlFor={id}
        className={classnames(s.label, { [s.disabled]: disabled })}
      >
        {label}
      </label>
      <Button
        id={id}
        className={s.button}
        onClick={() => onClick()}
        disabled={disabled}
      >
        {children}
      </Button>
    </div>
  )
})
