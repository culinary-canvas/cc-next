import { GetStaticProps } from 'next'
import React from 'react'
import { SignIn } from '../../admin/signIn/SingIn'
import { useAuth } from '../../services/auth/Auth'
import s from './admin.module.scss'

function AdminHome() {
  const auth = useAuth()

  return (
    <main className={s.container}>
      <h1>Admin</h1>
      {!auth.isSignedIn && <SignIn />}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

export default AdminHome
