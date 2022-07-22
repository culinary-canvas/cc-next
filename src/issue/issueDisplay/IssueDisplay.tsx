import classNames from 'classnames'
import { format } from 'date-fns'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ArticleModel } from '../../article/models/Article.model'
import StringUtils from '../../services/utils/StringUtils'
import { ClientRender } from '../../shared/ClientRender/ClientRender'
import { IssueModel } from '../models/Issue.model'
import s from './IssueDisplay.module.scss'

interface Props {
  article?: ArticleModel
  issue: IssueModel
  className?: string
}

export const IssueDisplay = observer(({ issue, article, className }: Props) => {
  return (
    <ClientRender>
      <div
        className={classNames(s.container, !issue && s.hidden, className)}
        style={{ backgroundColor: issue?.backgroundColor, color: issue?.color }}
      >
        <small className={s.month}>
          {!!issue?.publishMonth && format(issue.publishMonth, 'MMMM yyyy')}
        </small>
        <span className={s.name}>{issue?.name}</span>
{/*
        <span className={s.type}>
          {article?.type ? StringUtils.toDisplayText(article.type) : 'Type'}
        </span>
*/}
      </div>
    </ClientRender>
  )
})
