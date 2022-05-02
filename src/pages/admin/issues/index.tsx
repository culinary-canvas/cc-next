import { GetServerSideProps } from 'next'
import React from 'react'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { IssueApi } from '../../../issue/Issue.api'
import { IssueList } from '../../../issue/list/IssueList'
import { IssueModel } from '../../../issue/models/Issue.model'
import s from './IssuesListPage.module.scss'

interface Props {
  issuesData: { [key: string]: any }[]
}

function IssueListPage({ issuesData }: Props) {
  const issues = useTransformToModels(issuesData, IssueModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }
  return (
    <main className={s.container}>
      <article className={s.list}>
        <IssueList issues={issues} />
      </article>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const issuesData = await IssueApi.allNoTransform()

  return {
    props: {
      issuesData: JSON.parse(JSON.stringify(issuesData)),
    },
  }
}

export default IssueListPage
