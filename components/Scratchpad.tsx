
import React, { useState } from 'react';

const Scratchpad: React.FC = () => {
  const [notes, setNotes] = useState('');

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Scratchpad</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down your thoughts..."
        className="flex-1 p-2 w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none resize-none"
      />
    </div>
  );
};

export default Scratchpad;
