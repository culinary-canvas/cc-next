import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React, { useRef } from 'react'
import { PersonForm } from '../../../../person/form/PersonForm'
import { PersonModel } from '../../../../person/models/Person.model'
import s from './personCreatePage.module.scss'

const PersonCreatePage = observer(() => {
  const person = useRef(new PersonModel()).current
  return (
    <main className={s.container}>
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
