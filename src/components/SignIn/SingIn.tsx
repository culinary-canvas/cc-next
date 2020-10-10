import React, { useState } from 'react'
import { useAuth } from '../../services/auth/Auth'
import s from './SignIn.module.scss'
import { Spinner } from '../Spinner/Spinner'
import { FONT } from '../../styles/font'

export function SignIn() {
  const auth = useAuth()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)

  return (
    <article className={s.content}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setLoading(true)
          auth.signIn(email, password)
        }}
      >
        <input
          type="text"
          placeholder="Email"
          autoComplete="on"
          onChange={(v) => setEmail(v.target.value)}
          value={email}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="on"
          onChange={(v) => setPassword(v.target.value)}
          value={password}
          disabled={loading}
        />
        <button
          type="submit"
          className="button"
          disabled={
            loading ||
            email === '' ||
            password === '' ||
            password.length < 6 ||
            !email.includes('@') ||
            !email.includes('.')
          }
        >
          {loading ? 'Signing in' : 'Sign in'}
          {loading && <Spinner size={FONT.SIZE.XXL} />}
        </button>
      </form>
    </article>
  )
}
