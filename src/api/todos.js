import { apiFetch } from './client'

const API_BASE = '/api/todos'

export async function fetchTodos() {
  return apiFetch(API_BASE)
}

export async function createTodo(todo) {
  return apiFetch(API_BASE, {
    method: 'POST',
    body: JSON.stringify(todo),
  })
}

export async function updateTodo(id, todo) {
  return apiFetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  })
}

export async function toggleTodo(id) {
  return apiFetch(`${API_BASE}/${id}/toggle`, {
    method: 'PATCH',
  })
}

export async function deleteTodo(id) {
  return apiFetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
}
