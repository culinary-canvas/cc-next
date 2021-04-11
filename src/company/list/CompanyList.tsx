import React from 'react'
import s from './CompanyList.module.scss'
import { CompanyModel } from '../models/Company.model'
import { Button } from '../../shared/button/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import StringUtils from '../../services/utils/StringUtils'

interface Props {
  companies: CompanyModel[]
}

export function CompanyList({ companies }: Props) {
  const router = useRouter()
  return (
    <>
      <h1>
        Companies
        <Button onClick={() => router.push('/admin/companies/create')}>
          Create
        </Button>
      </h1>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Web site</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                <Link href={`/admin/companies/${company.id}`}>
                  {company.name}
                </Link>
              </td>
              <td>{StringUtils.toDisplayText(company.type)}</td>
              <td>{company.web}</td>
              <td>{company.created?.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
