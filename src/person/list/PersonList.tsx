import React from 'react'
import s from './PersonList.module.scss'
import { PersonModel } from '../Person.model'
import { Button } from '../../form/button/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react'
import { Spinner } from '../../shared/spinner/Spinner'
import { COLOR } from '../../styles/_color'

interface Props {
  persons: PersonModel[]
}

export const PersonList = observer(({ persons }: Props) => {
  const router = useRouter()
  return (
    <>
      <h1>
        Persons
        <Button onClick={() => router.push('/admin/persons/create')}>
          Create
        </Button>
      </h1>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Web site</th>
            <th>Company</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td>
                <Link href={`/admin/persons/${person.id}`}>{person.name}</Link>
              </td>

              <td>{person.web}</td>

              <td>
                {!!person.companyId && !person.company && (
                  <Spinner color={COLOR.GREY_LIGHT} />
                )}
                {!!person.company && person.company.name}
              </td>

              <td>{person.created?.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
})
