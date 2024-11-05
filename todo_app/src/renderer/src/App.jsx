import { useState, useRef, useEffect } from 'react'
import './styles/main.css'
const { execFile } = require('child_process')
const path = require('path')

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingTaskIndex, setEditingTaskIndex] = useState(null)
  const currentDate = new Date().toISOString().split('T')[0]
  const inputRef = useRef(null)
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult ] = useState(null);
  const [num, setNum] = useState('')
  const [fibresult, setFibresult] = useState(null)

  const handleAddition = () => {
    // Path to the Python script
    const pythonScriptPath = path.join('todo_app', '../src/renderer/src/add.py');

    // Spawn a child process to execute the Python script
    execFile('python', [pythonScriptPath, num1, num2], (error, stdout, stderr) => {
        if (error) {
            console.error("Error executing Python script:", error);
            return;
        }
        if (stderr) {
            console.error("Python script error:", stderr);
            return;
        }
        setResult(stdout.trim());
    });
};
const handleFibonacci = () => {
  const pythonScriptPath = path.join('todo_app', '../src/renderer/src/add.py');

  execFile('python', [pythonScriptPath, num], (error, stdout, stderr) => {
      if (error) {
          console.error("Error executing Python script:", error);
          return;
      }
      if (stderr) {
          console.error("Python script error:", stderr);
          return;
      }
      setFibresult(stdout.trim());
  });
};

  const addTask = () => {
    if (tasks.some((task) => task.title === newTaskTitle)) {
      alert('Task with the same name already exists!')
      inputRef.current.focus()
      return
    }
    if (newTaskTitle && newTaskDeadline) {
      setTasks([
        ...tasks,
        {
          title: newTaskTitle,
          deadline: newTaskDeadline,
          priority: newTaskPriority || 'medium',
          status: 'pending'
        }
      ])
      setNewTaskTitle('')
      setNewTaskDeadline('')
      setNewTaskPriority('')
      inputRef.current.focus()
    }
  }

  const toggleTaskStatus = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status: task.status === 'pending' ? 'done' : 'pending' } : task
    )
    setTasks(updatedTasks)
  }

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
  }

  const startEditing = (index) => {
    const taskToEdit = tasks[index]
    setNewTaskTitle(taskToEdit.title)
    setNewTaskDeadline(taskToEdit.deadline)
    setNewTaskPriority(taskToEdit.priority)
    setEditingTaskIndex(index)
  }

  const saveEdit = () => {
    if (newTaskTitle && newTaskDeadline) {
      const updatedTasks = tasks.map((task, index) =>
        index === editingTaskIndex
          ? { ...task, title: newTaskTitle, deadline: newTaskDeadline, priority: newTaskPriority }
          : task
      )
      setTasks(updatedTasks)
      setNewTaskTitle('')
      setNewTaskDeadline('')
      setNewTaskPriority('')
      setEditingTaskIndex(null)
      inputRef.current.focus()
    }
  }

  const cancelEdit = () => {
    setNewTaskTitle('')
    setNewTaskDeadline('')
    setNewTaskPriority('')
    setEditingTaskIndex(null)
    inputRef.current.focus()
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <div className="task-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="date"
          placeholder="Deadline"
          value={newTaskDeadline}
          onChange={(e) => setNewTaskDeadline(e.target.value)}
          min={currentDate}
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          required
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="add-task-button">
        {editingTaskIndex !== null ? (
          <>
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>

      <div className="task-filters">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Completed</option>
        </select>
      </div>

        <div className="App">
          <h3>Addition with Python</h3>
          <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="Enter first number"
          />
          <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="Enter second number"
          />
          <button onClick={handleAddition}>Add Numbers</button>
          {result !== null && <p>Result: {result}</p>}
      </div>
        <div className="App">
          <h3>fibanocci</h3>
          <input
            type="number"
            value={num}
            onChange={(e)=> setNum(e.target.value)}
            placeholder="enter ur number"
          />
          <button onClick={handleFibonacci}>Fibonacci</button>
          {fibresult!== null && <p>{num}th fibanocci number is: {fibresult}</p>}
        </div>
      <ul className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => {
            const isOverdue = new Date(task.deadline) < new Date(currentDate)
            const displayStatus = isOverdue ? 'missing' : task.status
            const priorityClass = `priority-${task.priority}`

            return (
              <li
                key={index}
                className={`${priorityClass} ${task.status === 'done' ? 'completed' : ''}`}
              >
                <span>
                  {task.title} (Deadline: {task.deadline})
                </span>
                <span>Status: {displayStatus}</span>
                <button onClick={() => startEditing(index)}>Edit</button>
                <button
                  onClick={() => deleteTask(index)}
                  style={{ backgroundColor: '#dc3545', color: 'white' }}
                >
                  Delete
                </button>
                <button onClick={() => toggleTaskStatus(index)}>
                  {task.status === 'pending' ? 'Mark as Done' : 'Mark as Pending'}
                </button>
              </li>
            )
          })
        ) : (
          <li>No tasks available. Add your first task!</li>
        )}
      </ul>
    </div>
  )
}

export default App
