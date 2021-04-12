import React from 'react'
import { observer } from 'mobx-react-lite'
import { CompanyModel } from '../../../../company/models/Company.model'
import { CompanyApi } from '../../../../company/Company.api'
import { GetServerSideProps } from 'next'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { CompanyForm } from '../../../../company/form/CompanyForm'
import { AdminMenu } from '../../../../admin/menu/AdminMenu'
import s from './companyEditPage.module.scss'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'

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
      <AdminMenu />
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
