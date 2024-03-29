import { GetServerSideProps } from 'next'
import React, { useEffect } from 'react'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useTransformToModels } from '../../../hooks/useTransformToModels'
import { PersonList } from '../../../person/list/PersonList'
import { PersonModel } from '../../../person/models/Person.model'
import { PersonApi } from '../../../person/Person.api'
import { PersonService } from '../../../person/Person.service'
import s from './personList.module.scss'

interface Props {
  personsData: { [key: string]: any }[]
}

function PersonListPage({ personsData }: Props) {
  const persons = useTransformToModels(personsData, PersonModel)
  const allowed = useAuthGuard()

  useEffect(() => {
    PersonService.populate(persons)
  }, [persons])

  if (!allowed) {
    return null
  }

  return (
    <main className={s.container}>
      <article className={s.list}>
        <PersonList persons={persons} />
      </article>
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
