import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React from 'react'
import s from './IssueDisplay.module.scss'
import { IssueModel } from '../models/Issue.model'

interface Props {
  issue: IssueModel
}

export const IssueDisplay = observer(({ issue }: Props) => {
  return (
    <div className={s.issue}>
      <span>{issue?.name}</span>
      <small>{!!issue && format(issue.publishMonth, 'MMMM yyyy')}</small>
    </div>
  )
})
