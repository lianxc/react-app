import React, { useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '@/hooks/useStorage'
import useDebounce from '@/hooks/useDebounce'

interface Todo {
  id: number
  text: string
  completed: boolean
  isEditing: boolean
}
const Todo = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const inputRef = useRef<HTMLInputElement>(null)

  // 添加待办事项
  const addTodo = () => {
    if (input.trim() === '') {
      setInput('');
      inputRef.current?.focus()
      return
    }
    const newId = todos.length ? todos[todos.length - 1].id + 1 : 1
    setTodos([...todos, { id: newId, text: input, completed: false, isEditing: false }])
    setInput('')
  }

  // 删除待办事项
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id).map((todo, index) => ({ ...todo, id: index + 1 })))
  }

  // 切换待办事项状态
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  // 编辑待办事项
  const editTodo = (id: number, text: string) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: text } : todo))
  }

  // 设置待办事项编辑状态
  const setTodoEditing = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo))
  }

  // 过滤待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return false
  })

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
  }

  return (
    <div>
      <h3>待办事项：{stats.active}项未完成</h3>

      <div className="add-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTodo()
            }
          }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* 筛选按钮 */}
      <div className="filter-wrapper">
        <button onClick={() => setFilter('all')}>全部 ({stats.total})</button>
        <button onClick={() => setFilter('active')}>未完成 ({stats.active})</button>
        <button onClick={() => setFilter('completed')}>已完成 ({stats.completed})</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span className="todo-id">{todo.id}.</span>
            {todo.isEditing ? (
              <input
                type="text"
                value={todo.text}
                onChange={(e) => editTodo(todo.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    editTodo(todo.id, e.target.value)
                    setTodoEditing(todo.id)
                  }
                }}
              />
            ) : (
              <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
            )}
            {todo.isEditing ? (
              <button onClick={() => setTodoEditing(todo.id)}>Save</button>
            ) : (
              <button onClick={() => setTodoEditing(todo.id)}>Edit</button>
            )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false)
  
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDark])
  
  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? '🌞 亮色模式' : '🌙 深色模式'}
    </button>
  )
}

// 使用示例：实时保存
export const AutoSaveEditor = () => {
  const [content, setContent] = useLocalStorage('local-content', '');
  const debouncedContent = useDebounce(content, 1000)
  const [saveStatus, setSaveStatus] = useState('已保存')

  useEffect(() => {
    if (debouncedContent) {
      setSaveStatus('保存中...')
      // 模拟保存 API
      setTimeout(() => {
        console.log('保存内容:', debouncedContent)
        setSaveStatus('已保存')
      }, 2000)
    }
  }, [debouncedContent])
  
  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入内容，会自动保存..."
        rows={5}
        cols={40}
      />
      <p>状态: {saveStatus}</p>
    </div>
  )
}

// 鼠标跟踪器
export const MouseTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    document.addEventListener('mousemove', (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    })
    return () => {
      document.removeEventListener('mousemove', (e) => {
        setPosition({ x: e.clientX, y: e.clientY })
      })
    }
  }, [])

  return (
    <p>鼠标位置: {position.x}, {position.y}</p>
  )
}

export default Todo