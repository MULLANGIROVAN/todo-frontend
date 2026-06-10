import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'
import './Auth.css'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to manage your personal tasks</p>
        </div>

        <Form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" className="auth-error">
              <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true" />
              {error}
            </Alert>
          )}

          <div className="auth-field">
            <label htmlFor="login-email">
              <i className="bi bi-envelope" aria-hidden="true" />
              Email
            </label>
            <Form.Control
              id="login-email"
              type="email"
              className="form-control-custom"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">
              <i className="bi bi-lock" aria-hidden="true" />
              Password
            </label>
            <div className="auth-password-wrap">
              <Form.Control
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-custom"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
              </button>
            </div>
          </div>

          <Button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true" />
                Sign in
              </>
            )}
          </Button>
        </Form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
