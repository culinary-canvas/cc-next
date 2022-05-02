import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React, { useRef } from 'react'
import { CompanyForm } from '../../../../company/form/CompanyForm'
import { CompanyModel } from '../../../../company/models/Company.model'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import s from './companyCreatePage.module.scss'

const CompanyCreatePage = observer(() => {
  const company = useRef(new CompanyModel()).current
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

export default CompanyCreatePage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
