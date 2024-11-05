import { useState } from 'react'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleAddTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input])
      setInput('')
    }
  }

  const handleDeleteTodo = (index) => {
    const newTodos = [...todos]
    newTodos.splice(index, 1)
    setTodos(newTodos)
  }

  return (
    <div>
      <input type="text" value={input} onChange={handleInputChange} placeholder="Add a new task" />
      <button onClick={handleAddTodo}>Add Task</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => handleDeleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
