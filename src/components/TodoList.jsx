import TodoItem from './TodoItem'

const EMPTY_CONFIG = {
  all: {
    icon: 'bi-inbox',
    title: 'No tasks yet',
    message: 'Add your first todo above and start being productive!',
  },
  active: {
    icon: 'bi-emoji-smile',
    title: 'All caught up',
    message: 'You have no active tasks. Great job!',
  },
  completed: {
    icon: 'bi-trophy',
    title: 'Nothing completed yet',
    message: 'Complete a task to see it here.',
  },
}

export default function TodoList({ todos, filter, onToggle, onUpdate, onDelete }) {
  const filtered = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  if (filtered.length === 0) {
    const { icon, title, message } = EMPTY_CONFIG[filter]

    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </div>
        <h4 className="empty-title">{title}</h4>
        <p className="empty-message">{message}</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
