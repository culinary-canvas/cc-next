import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React from 'react'
import { IssueModel } from '../../../../issue/models/Issue.model'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { IssueForm } from '../../../../issue/form/IssueForm'
import { IssueApi } from '../../../../issue/Issue.api'
import s from './issueEditPage.module.scss'

interface Props {
  data: { [key: string]: any }
}

const IssueEditPage = observer((props: Props) => {
  const { data } = props
  const issue = useTransformToModel(data, IssueModel)
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

export default IssueEditPage

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ params }) => {
  const data = await IssueApi.byId(params.id)

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  }
}
