import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { PersonModel } from '../../../../person/models/Person.model'
import { GetServerSideProps } from 'next'
import { PersonForm } from '../../../../person/form/PersonForm'
import { AdminMenu } from '../../../../admin/menu/AdminMenu'
import s from './personCreatePage.module.scss'

const PersonCreatePage = observer(() => {
  const person = useRef(new PersonModel()).current
  return (
    <main className={s.container}>
      <AdminMenu />
      <PersonForm person={person} />
    </main>
  )
})

export default PersonCreatePage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
