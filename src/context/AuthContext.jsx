import { createContext, useContext, useMemo, useState } from 'react'
import * as authApi from '../api/auth'
import { clearAuth, getStoredUser, getToken, saveAuth } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => getToken())

  const isAuthenticated = Boolean(token && user)

  async function login(credentials) {
    const data = await authApi.login(credentials)
    const authUser = { name: data.name, email: data.email }
    saveAuth(data.token, authUser)
    setToken(data.token)
    setUser(authUser)
    return authUser
  }

  async function signup(credentials) {
    const data = await authApi.signup(credentials)
    const authUser = { name: data.name, email: data.email }
    saveAuth(data.token, authUser)
    setToken(data.token)
    setUser(authUser)
    return authUser
  }

  function logout() {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, signup, logout }),
    [user, token, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
