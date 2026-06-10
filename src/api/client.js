const TOKEN_KEY = 'todo_token'
const USER_KEY = 'todo_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const text = await response.text()
      if (text) {
        try {
          const json = JSON.parse(text)
          message = json.message || json.error || text
        } catch {
          message = text
        }
      }
    } catch {
      // keep default message
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  if (response.status === 204) {
    return null
  }
  return response.json()
}

export async function apiFetch(url, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })
  return handleResponse(response)
}
