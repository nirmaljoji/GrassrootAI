import React, { useState, useEffect } from 'react';
import FlipMove from 'react-flip-move';

interface Task {
  id: number;
  resource: string;
  completed?: boolean;
}

// Add a props interface for TodoList
interface TodoListProps {
  listName: string;
  eventId?: string;
}

const TodoList: React.FC<TodoListProps> = ({ listName , eventId}) => {
  
  const [todos, setTodos] = useState<Task[]>([]);

  // Fetch todos from the API when the component mounts or listName changes
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:5001/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: eventId })
        });
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleCheckboxChange = (id: number) => {
    setTodos(prevTodos =>
      [...prevTodos]
        .map(task =>
          task.id === id ? { ...task, completed: !!!task.completed } : task
        )
    );
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      {/* Replace hardcoded list title with programmable listName */}
      <h2 className="text-xl font-bold mb-2">{listName}</h2>
      <FlipMove typeName="ul" duration={100} className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`flex items-center ${todo.completed ? 'text-gray-400 line-through' : ''}`}
          >
            <input 
              type="checkbox" 
              checked={todo.completed ?? false}  
              onChange={() => handleCheckboxChange(todo.id)}
              className="mr-2"
            />
            {todo.resource ??  ""}
          </li>
        ))}
      </FlipMove>
    </div>
  );
};

export default TodoList;