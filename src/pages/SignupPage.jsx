import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'
import './Auth.css'

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await signup({ name, email, password })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <i className="bi bi-person-plus" aria-hidden="true" />
          </div>
          <h1>Create account</h1>
          <p>Sign up to save and manage your own tasks</p>
        </div>

        <Form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" className="auth-error">
              <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true" />
              {error}
            </Alert>
          )}

          <div className="auth-field">
            <label htmlFor="signup-name">
              <i className="bi bi-person" aria-hidden="true" />
              Full name
            </label>
            <Form.Control
              id="signup-name"
              type="text"
              className="form-control-custom"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">
              <i className="bi bi-envelope" aria-hidden="true" />
              Email
            </label>
            <Form.Control
              id="signup-email"
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
            <label htmlFor="signup-password">
              <i className="bi bi-lock" aria-hidden="true" />
              Password
            </label>
            <div className="auth-password-wrap">
              <Form.Control
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-custom"
                placeholder="At least 6 characters"
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

          <div className="auth-field">
            <label htmlFor="signup-confirm">
              <i className="bi bi-shield-lock" aria-hidden="true" />
              Confirm password
            </label>
            <Form.Control
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              className="form-control-custom"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <Button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2" aria-hidden="true" />
                Sign up
              </>
            )}
          </Button>
        </Form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
