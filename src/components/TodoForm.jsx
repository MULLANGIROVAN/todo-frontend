import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || null,
        completed: false,
      })
      setTitle('')
      setDescription('')
    } catch {
      // Error is shown in App via the error banner.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="todo-form">
      <div className="form-field">
        <label htmlFor="todo-title" className="form-field-label">
          <i className="bi bi-pencil-square" aria-hidden="true" />
          Title
        </label>
        <Form.Control
          id="todo-title"
          type="text"
          className="form-control-custom"
          placeholder="What do you need to accomplish?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="form-field">
        <label htmlFor="todo-description" className="form-field-label">
          <i className="bi bi-card-text" aria-hidden="true" />
          Description
          <span className="optional-tag">optional</span>
        </label>
        <Form.Control
          id="todo-description"
          as="textarea"
          rows={2}
          className="form-control-custom"
          placeholder="Add more details…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
        />
      </div>

      <Button type="submit" className="btn-add" disabled={submitting || !title.trim()}>
        {submitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Adding…
          </>
        ) : (
          <>
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Add task
          </>
        )}
      </Button>
    </Form>
  )
}
