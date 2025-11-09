
import React from 'react';
import AITutorChat from './components/AITutorChat';
import PomodoroTimer from './components/PomodoroTimer';
import TodoList from './components/TodoList';
import Scratchpad from './components/Scratchpad';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900">
      <header className="p-4 bg-white dark:bg-slate-800/50 shadow-md">
        <h1 className="text-2xl font-bold text-center text-primary-dark dark:text-primary-light">
          FocusFlow AI Study Space
        </h1>
      </header>
      
      <main className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <PomodoroTimer />
          <TodoList />
        </aside>
        
        {/* Main Content */}
        <div className="lg:col-span-2 xl:col-span-3 h-[calc(100vh-120px)] flex flex-col">
          <AITutorChat />
        </div>
        
        {/* Right Sidebar */}
        <aside className="lg:col-span-1 xl:col-span-1 h-[calc(100vh-120px)] hidden xl:flex">
           <Scratchpad />
        </aside>
      </main>
    </div>
  );
};

export default App;
