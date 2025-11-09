
import React from 'react';

export const BotIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-light text-white flex-shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect x="4" y="12" width="16" height="8" rx="2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M12 12v-2" />
      <path d="M12 12v-2a2 2 0 0 1 4 0v2" />
      <path d="M12 12v-2a2 2 0 0 0-4 0v2" />
    </svg>
  </div>
);
