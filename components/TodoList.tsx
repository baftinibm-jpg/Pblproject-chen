
import React, { useState } from 'react';
import type { TodoItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">To-Do List</h2>
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task..."
          className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          <PlusIcon />
        </button>
      </form>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-md group">
            <div className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="form-checkbox h-5 w-5 text-primary-dark rounded focus:ring-primary"
                />
                <span className={`flex-1 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                {task.text}
                </span>
            </div>
            <button
              onClick={() => removeTask(task.id)}
              className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
        {tasks.length === 0 && <p className="text-sm text-center text-slate-500 dark:text-slate-400">No tasks yet. Add one!</p>}
      </ul>
    </div>
  );
};

export default TodoList;
