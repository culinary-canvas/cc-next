import React from 'react'
import { GetServerSideProps } from 'next'
import s from './personList.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../hooks/useTransformToModel'
import { PersonModel } from '../../../person/Person.model'
import { PersonApi } from '../../../person/Person.api'
import { PersonList } from '../../../person/list/PersonList'
import { AdminMenu } from '../../../admin/menu/AdminMenu'

interface Props {
  personsData: { [key: string]: any }[]
}

function PersonListPage({ personsData }: Props) {
  const persons = useTransformToModel(personsData, PersonModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }

  return (
    <main className={s.container}>
      <AdminMenu />
      <PersonList persons={persons} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await PersonApi.allNoTransform()

  return {
    props: {
      personsData: JSON.parse(JSON.stringify(data)),
    },
  }
}

export default PersonListPage
