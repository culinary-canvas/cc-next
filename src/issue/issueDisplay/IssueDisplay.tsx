import classNames from 'classnames'
import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ClientRender } from '../../shared/ClientRender/ClientRender'
import { IssueModel } from '../models/Issue.model'
import s from './IssueDisplay.module.scss'

interface Props {
  issue: IssueModel
  className?: string
}

export const IssueDisplay = observer(({ issue, className }: Props) => {
  return (
    <ClientRender>
      <div className={classNames(s.issue, !issue && s.hidden, className)}>
        <span>{issue?.name}</span>
        <small>{!!issue && format(issue.publishMonth, 'MMMM yyyy')}</small>
      </div>
    </ClientRender>
  )
})
