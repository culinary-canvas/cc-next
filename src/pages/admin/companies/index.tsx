import { GetServerSideProps } from 'next'
import React from 'react'
import { CompanyApi } from '../../../company/Company.api'
import { CompanyList } from '../../../company/list/CompanyList'
import { CompanyModel } from '../../../company/models/Company.model'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import s from './companyList.module.scss'

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
      <article className={s.list}>
        <CompanyList companies={companies} />
      </article>
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
