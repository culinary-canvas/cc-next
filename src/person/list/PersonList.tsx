import React, { useCallback, useEffect, useState } from 'react'
import s from './PersonList.module.scss'
import { PersonModel } from '../models/Person.model'
import { Button } from '../../shared/button/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { Spinner } from '../../shared/spinner/Spinner'
import { COLOR } from '../../styles/_color'
import { get } from 'lodash'

interface Props {
  persons: PersonModel[]
}

export const PersonList = observer(({ persons }: Props) => {
  const router = useRouter()

  const [orderBy, setOrderBy] = useState<keyof PersonModel | string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [sorted, setSorted] = useState<PersonModel[]>(persons)

  const sort = useCallback(
    (by: keyof PersonModel | string) => {
      if (by === orderBy) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortDirection('asc')
      }
      setOrderBy(by)
    },
    [orderBy, sortDirection],
  )

  useEffect(() => {
    setSorted(
      persons.sort((p1, p2) => {
        const p1StringValue = String(get(p1, orderBy))
        const p2StringValue = String(get(p2, orderBy))
        return sortDirection === 'asc'
          ? p1StringValue.localeCompare(p2StringValue)
          : p2StringValue.localeCompare(p1StringValue)
      }),
    )
  }, [orderBy, sortDirection, persons, setSorted])

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
            <th onClick={() => sort('name')}>Name</th>
            <th onClick={() => sort('web')}>Web site</th>
            <th onClick={() => sort('company.name')}>Company</th>
            <th onClick={() => sort('created')}>Created</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((person) => (
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
