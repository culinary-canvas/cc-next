import { observer } from 'mobx-react-lite'
import React from 'react'
import { classnames } from '../../../../../../services/importHelpers'
import s from './ControlContainer.module.scss'

interface Props {
  label?: string
  id?: string
  labelButtons?: () => any
  children: any
  direction?: 'row' | 'column'
  className?: string
}

export const ControlContainer = observer((props: Props) => {
  const {
    label,
    labelButtons,
    id,
    children,
    direction = 'column',
    className,
  } = props

  return (
    <div className={s.container}>
      {!!label && (
        <div className={s.labelContainer}>
          <label htmlFor={id}>{label}</label>
          {!!labelButtons && labelButtons()}
        </div>
      )}
      <div
        className={classnames(s.content, className)}
        style={{ flexDirection: direction }}
      >
        {children}
      </div>
    </div>
  )
})
