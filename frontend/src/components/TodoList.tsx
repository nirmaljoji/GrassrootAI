import React, { useState } from 'react';
import FlipMove from 'react-flip-move';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Add a props interface for TodoList
interface TodoListProps {
  listName: string;
}

const TodoList: React.FC<TodoListProps> = ({ listName }) => {
  const [todos, setTodos] = useState<Task[]>([
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Walk the dog1', completed: false },
    { id: 3, text: 'Walk the dog2', completed: false },
    { id: 4, text: 'Walk the dog3', completed: false },
    { id: 5, text: 'Walk the dog4', completed: false },
    { id: 6, text: 'Walk the dog5', completed: false },
    { id: 7, text: 'Walk the dog6', completed: false },
    { id: 8, text: 'Walk the dog7', completed: false },
    { id: 9, text: 'Walk the dog8', completed: false },
    { id: 10, text: 'Walk the dog9', completed: false },
    { id: 11, text: 'Walk the dog10', completed: false },
    { id: 12, text: 'Read a book', completed: false }
  ]);

  const handleCheckboxChange = (id: number) => {
    setTodos(prevTodos =>
      [...prevTodos]
        .map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
        .sort((a, b) => Number(a.completed) - Number(b.completed))
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
              checked={todo.completed} 
              onChange={() => handleCheckboxChange(todo.id)}
              className="mr-2"
            />
            {todo.text}
          </li>
        ))}
      </FlipMove>
    </div>
  );
};

export default TodoList;