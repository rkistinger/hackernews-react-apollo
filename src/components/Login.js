import React from 'react'
import gql from 'graphql-tag'

import { AUTH_TOKEN } from '../constants'
import { useMutation } from '@apollo/react-hooks'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export default function Login(props) {
  const [isLogin, setIsLogin] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [executeMutation] = useMutation(
    isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION
  )

  async function submit() {
    const result = await executeMutation({
      variables: {
        email,
        password,
        name,
      },
    })
    const { token } = isLogin ? result.data.login : result.data.signup
    localStorage.setItem(AUTH_TOKEN, token)
    props.history.push('/')
  }

  return (
    <div>
      <h4 className="mv3">{isLogin ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!isLogin && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div className="pointer mr2 button" onClick={submit}>
          {isLogin ? 'login' : 'create account'}
        </div>
        <div
          className="pointer button"
          onClick={() => setIsLogin((isLogin) => !isLogin)}
        >
          {isLogin ? 'need to create an account?' : 'already have an account?'}
        </div>
      </div>
    </div>
  )
}
