import React from 'react'
import { observer } from 'mobx-react'
import s from './ControlContainer.module.scss'
import { classnames } from '../../../../../../../services/importHelpers'

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
