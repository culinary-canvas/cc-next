import React, { useState } from 'react'
import { useAuth } from '../../services/auth/Auth'

export function SignIn() {
  const auth = useAuth()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)

  return (
    <article className="content">
      <h1>Sign in</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setLoading(true)
          auth.signIn(email, password)
        }}
      >
        <div>
          <input
            type="text"
            placeholder="Email"
            autoComplete="on"
            onChange={(v) => setEmail(v.target.value)}
            value={email}
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            autoComplete="on"
            onChange={(v) => setPassword(v.target.value)}
            value={password}
            disabled={loading}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading || email === '' || password === ''}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </article>
  )
}
