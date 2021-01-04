import React from 'react'
import { useAuth } from '../../services/auth/Auth'
import { useRouter } from 'next/router'
import { SignIn } from '../../admin/signIn/SingIn'
import s from './admin.module.scss'
import { AdminMenu } from '../../admin/menu/AdminMenu'
import { GetStaticProps } from 'next'

function AdminHome() {
  const auth = useAuth()
  const router = useRouter()

  return (
    <main className={s.container}>
      {!auth.isSignedIn ? (
        <SignIn />
      ) : (
        <>
          <AdminMenu className={s.menuContainer} linkClassName={s.link}/>
        </>
      )}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

export default AdminHome
