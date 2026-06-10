import { useCallback, useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { useNavigate } from 'react-router-dom'
import * as todoApi from '../api/todos'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { useAuth } from '../context/AuthContext'
import '../App.css'

const FILTERS = [
  { id: 'all', label: 'All', icon: 'bi-collection' },
  { id: 'active', label: 'Active', icon: 'bi-lightning-charge' },
  { id: 'completed', label: 'Done', icon: 'bi-check2-circle' },
]

export default function TodoApp() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTodos = useCallback(async () => {
    setError(null)
    try {
      const data = await todoApi.fetchTodos()
      setTodos(data)
    } catch (err) {
      if (err.status === 401) {
        logout()
        navigate('/login')
        return
      }
      setError(
        err.message ||
          'Cannot reach the backend. Start Spring Boot first (port 8080) and make sure MySQL is running.',
      )
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  async function runAction(action) {
    setError(null)
    try {
      await action()
    } catch (err) {
      if (err.status === 401) {
        logout()
        navigate('/login')
        return
      }
      setError(err.message || 'Something went wrong. Please try again.')
      throw err
    }
  }

  async function handleAdd(todo) {
    await runAction(async () => {
      const created = await todoApi.createTodo(todo)
      setTodos((prev) => [...prev, created])
    })
  }

  async function handleToggle(id) {
    await runAction(async () => {
      const updated = await todoApi.toggleTodo(id)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    })
  }

  async function handleUpdate(id, todo) {
    await runAction(async () => {
      const updated = await todoApi.updateTodo(id, todo)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    })
  }

  async function handleDelete(id) {
    await runAction(async () => {
      await todoApi.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    })
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0

  return (
    <div className="app-page">
      <Container className="app-container app-layout">
        <header className="app-hero app-hero-compact">
          <div className="hero-icon">
            <i className="bi bi-check2-square" aria-hidden="true" />
          </div>
          <h1 className="hero-title">My Todo List</h1>
          <p className="hero-subtitle">Welcome back, {user?.name}</p>
          <div className="user-bar">
            <span className="user-email">
              <i className="bi bi-person-circle me-1" aria-hidden="true" />
              {user?.email}
            </span>
            <Button variant="outline-light" size="sm" className="logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </header>

        <div className="top-section-row">
          <div className="main-panel top-panel">
            <div className="panel-section">
              <div className="section-label">
                <i className="bi bi-plus-circle" aria-hidden="true" />
                New task
              </div>
              <TodoForm onAdd={handleAdd} />

              {error && (
                <Alert variant="danger" className="error-alert d-flex align-items-center justify-content-between gap-3 mb-0">
                  <span className="mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
                    {error}
                  </span>
                  <Button variant="outline-danger" size="sm" onClick={loadTodos}>
                    Retry
                  </Button>
                </Alert>
              )}
            </div>
          </div>

          <div className="main-panel top-panel">
            <div className="panel-section">
              <div className="section-label">
                <i className="bi bi-funnel" aria-hidden="true" />
                Filter
              </div>

              <div className="filter-pills filter-pills-vertical">
                {FILTERS.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`filter-pill ${filter === id ? 'active' : ''}`}
                    onClick={() => setFilter(id)}
                  >
                    <i className={`bi ${icon} me-2`} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>

              {todos.length > 0 && (
                <div className="progress-wrap">
                  <div className="progress-label progress-label-dark">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="stats-inline" aria-label="Task statistics">
                <div className="stat-card total">
                  <span className="stat-value">{todos.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-card active">
                  <span className="stat-value">{activeCount}</span>
                  <span className="stat-label">Active</span>
                </div>
                <div className="stat-card done">
                  <span className="stat-value">{completedCount}</span>
                  <span className="stat-label">Done</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-panel tasks-panel">
          <div className="panel-section">
            <div className="section-label">
              <i className="bi bi-list-task" aria-hidden="true" />
              Your tasks
            </div>

            <div className="tasks-scroll-area">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading…</span>
                  </div>
                  <p>Loading your todos…</p>
                </div>
              ) : (
                <TodoList
                  todos={todos}
                  filter={filter}
                  onToggle={handleToggle}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
