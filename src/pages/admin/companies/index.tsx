import React from 'react'
import { GetServerSideProps } from 'next'
import s from './companyList.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { CompanyModel } from '../../../company/models/Company.model'
import { CompanyApi } from '../../../company/Company.api'
import { CompanyList } from '../../../company/list/CompanyList'
import { AdminMenu } from '../../../admin/menu/AdminMenu'
import { useTransformToModels } from '../../../hooks/useTransformToModels'

interface Props {
  companiesData: { [key: string]: any }[]
}

function CompanyListPage({ companiesData }: Props) {
  const companies = useTransformToModels(companiesData, CompanyModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }
  return (
    <main className={s.container}>
      <AdminMenu />
      <CompanyList companies={companies} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await CompanyApi.allNoTransform()

  return {
    props: {
      companiesData: JSON.parse(JSON.stringify(data)),
    },
  }
}

export default CompanyListPage
