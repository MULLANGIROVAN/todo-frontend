import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) return

    setSaving(true)
    try {
      await onUpdate(todo.id, {
        title: title.trim(),
        description: description.trim() || null,
        completed: todo.completed,
      })
      setEditing(false)
    } catch {
      // Error shown in App.
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setTitle(todo.title)
    setDescription(todo.description ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <article className="todo-card editing">
        <Form.Control
          type="text"
          className="form-control-custom mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          aria-label="Edit title"
        />
        <Form.Control
          as="textarea"
          rows={2}
          className="form-control-custom mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
          aria-label="Edit description"
        />
        <div className="todo-card-actions">
          <Button className="btn-save" size="sm" onClick={handleSave} disabled={saving || !title.trim()}>
            <i className="bi bi-check-lg me-1" aria-hidden="true" />
            Save
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
        </div>
      </article>
    )
  }

  return (
    <article className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      <button
        type="button"
        className={`todo-check ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      >
        {todo.completed && <i className="bi bi-check-lg" aria-hidden="true" />}
      </button>

      <div className="todo-card-body">
        <h3 className="todo-card-title">{todo.title}</h3>
        {todo.description && <p className="todo-card-desc">{todo.description}</p>}
        <time className="todo-card-date" dateTime={todo.createdAt}>
          <i className="bi bi-clock me-1" aria-hidden="true" />
          {formatDate(todo.createdAt)}
        </time>
      </div>

      <div className="todo-card-actions">
        <button
          type="button"
          className="icon-btn edit"
          onClick={() => setEditing(true)}
          aria-label="Edit todo"
        >
          <i className="bi bi-pencil" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn delete"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        >
          <i className="bi bi-trash3" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
