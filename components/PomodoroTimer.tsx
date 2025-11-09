
import React, { useState, useEffect, useCallback } from 'react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (isWorkSession) {
      setMinutes(WORK_MINUTES);
    } else {
      setMinutes(BREAK_MINUTES);
    }
    setSeconds(0);
  }, [isWorkSession]);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            const newIsWorkSession = !isWorkSession;
            setIsWorkSession(newIsWorkSession);
            setMinutes(newIsWorkSession ? WORK_MINUTES : BREAK_MINUTES);
            setSeconds(0);
            setIsActive(false);
            // Optionally play a sound
            new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3').play().catch(e => console.error("Error playing sound", e));
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes, isWorkSession]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = isWorkSession 
    ? ((WORK_MINUTES * 60 - (minutes * 60 + seconds)) / (WORK_MINUTES * 60)) * 100
    : ((BREAK_MINUTES * 60 - (minutes * 60 + seconds)) / (BREAK_MINUTES * 60)) * 100;


  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-center">
      <h2 className="text-lg font-semibold mb-2">Pomodoro Timer</h2>
      <div className="my-4 relative w-36 h-36 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle 
             className={isWorkSession ? "text-red-500" : "text-green-500"}
             strokeWidth="8"
             strokeDasharray={2 * Math.PI * 45}
             strokeDashoffset={(2 * Math.PI * 45) * (1 - progress / 100)}
             strokeLinecap="round"
             stroke="currentColor"
             fill="transparent"
             r="45"
             cx="50"
             cy="50"
             style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear'}}
            />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-mono">{timeDisplay}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isWorkSession ? 'Focus' : 'Break'}</p>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
