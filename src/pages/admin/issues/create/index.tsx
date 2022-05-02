import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React, { useRef } from 'react'
import { IssueModel } from '../../../../issue/models/Issue.model'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { IssueForm } from '../../../../issue/form/IssueForm'
import s from './issueCreatePage.module.scss'

const IssueCreatePage = observer(() => {
  const issue = useRef(new IssueModel()).current
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }

  return (
    <main className={s.container}>
      <IssueForm issue={issue} />
    </main>
  )
})

export default IssueCreatePage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
