import React from 'react'
import upArrow from '../../../public/assets/icons/streamline-icon-keyboard-arrow-up@140x140.svg'
import downArrow from '../../../public/assets/icons/streamline-icon-keyboard-arrow-down@140x140.svg'
import s from './SortOrderIcon.module.scss'

interface Props {
  order: 'asc' | 'desc'
  visible: boolean
}

export function SortOrderIcon({ order, visible }: Props) {
  return (
    visible && (
      <img
        className={s.icon}
        src={order === 'asc' ? downArrow : upArrow}
        alt={order === 'asc' ? 'Ascending' : 'Descending'}
      />
    )
  )
}
