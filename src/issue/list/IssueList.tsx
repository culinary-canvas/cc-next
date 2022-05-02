import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import StringUtils from '../../services/utils/StringUtils'
import { Button } from '../../shared/button/Button'
import { IssueModel } from '../models/Issue.model'
import s from './IssueList.module.scss'

interface Props {
  issues: IssueModel[]
}

export function IssueList({ issues }: Props) {
  const router = useRouter()
  return (
    <>
      <h1>
        Issues
        <Button onClick={() => router.push('/admin/issues')}>Create</Button>
      </h1>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Month</th>
            <th># articles</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <Link href={`/admin/issues/${issue.id}`}>{issue.name}</Link>
              </td>
              <td>{format(issue.publishMonth, 'MMMM yyyy')}</td>
              <td style={{ color: 'grey' }}>(Not implemented yet...)</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
