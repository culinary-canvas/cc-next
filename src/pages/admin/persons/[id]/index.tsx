import React from 'react'
import { observer } from 'mobx-react'
import { PersonModel } from '../../../../person/models/Person.model'
import { PersonApi } from '../../../../person/Person.api'
import { GetServerSideProps } from 'next'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { PersonForm } from '../../../../person/form/PersonForm'
import { AdminMenu } from '../../../../admin/menu/AdminMenu'
import s from './personEditPage.module.scss'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'

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
      <AdminMenu />
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
