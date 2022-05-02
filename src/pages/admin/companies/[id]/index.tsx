import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React from 'react'
import { CompanyApi } from '../../../../company/Company.api'
import { CompanyForm } from '../../../../company/form/CompanyForm'
import { CompanyModel } from '../../../../company/models/Company.model'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import s from './companyEditPage.module.scss'

interface Props {
  data: { [key: string]: any }
}

const CompanyEditPage = observer((props: Props) => {
  const { data } = props
  const company = useTransformToModel(data, CompanyModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }

  return (
    <main className={s.container}>
      <CompanyForm company={company} />
    </main>
  )
})

export default CompanyEditPage

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ params }) => {
  const data = await CompanyApi.byId(params.id)

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  }
}
