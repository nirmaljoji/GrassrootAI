import React, { useState, useEffect } from 'react';
import FlipMove from 'react-flip-move';
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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

const TodoList: React.FC<TodoListProps> = ({ listName, eventId }) => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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
          task.id === id ? { ...task, completed: !task.completed } : task
        )
    );
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center space-x-4 pb-2">
          <h2 className="text-xl font-bold">{listName}</h2>
          <CollapsibleTrigger className="flex items-center">
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "" : "-rotate-90"
              }`}
            />
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <FlipMove typeName="ul" duration={100} className="space-y-3">
            {todos.map(todo => (
              <li
                key={todo.id}
                className={`flex items-center space-x-2 ${
                  todo.completed ? 'text-gray-400' : ''
                }`}
              >
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => handleCheckboxChange(todo.id)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-sm ${
                    todo.completed ? 'line-through' : ''
                  }`}
                >
                  {todo.resource}
                </label>
              </li>
            ))}
          </FlipMove>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TodoList;