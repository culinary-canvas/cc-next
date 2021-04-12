import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { CompanyModel } from '../../../../company/models/Company.model'
import { GetServerSideProps } from 'next'
import { CompanyForm } from '../../../../company/form/CompanyForm'
import { AdminMenu } from '../../../../admin/menu/AdminMenu'
import s from './companyCreatePage.module.scss'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'

const CompanyCreatePage = observer(() => {
  const company = useRef(new CompanyModel()).current
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

export default CompanyCreatePage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
