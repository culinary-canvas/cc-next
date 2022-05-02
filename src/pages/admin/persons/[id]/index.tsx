import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React from 'react'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { PersonForm } from '../../../../person/form/PersonForm'
import { PersonModel } from '../../../../person/models/Person.model'
import { PersonApi } from '../../../../person/Person.api'
import s from './personEditPage.module.scss'

interface Props {
  data: { [key: string]: any }
}

const PersonEditPage = observer((props: Props) => {
  const { data } = props
  const person = useTransformToModel(data, PersonModel)
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }

  return (
    <main className={s.container}>
      <PersonForm person={person} />
    </main>
  )
})

export default PersonEditPage

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async ({ params }) => {
  const data = await PersonApi.byId(params.id)

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  }
}
