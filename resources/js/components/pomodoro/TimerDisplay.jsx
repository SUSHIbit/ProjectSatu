import React from 'react';
import { formatTime } from '@/utils/formatTime';
import { TIMER_MODES } from '@/contexts/PomodoroContext';

const TimerDisplay = ({ time, mode }) => {
  // Mode labels for display
  const modeLabels = {
    [TIMER_MODES.FOCUS]: 'Focus Time',
    [TIMER_MODES.SHORT_BREAK]: 'Short Break',
    [TIMER_MODES.LONG_BREAK]: 'Long Break',
  };
  
  const formattedTime = formatTime(time);
  
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">{modeLabels[mode]}</h2>
      <div className="text-7xl font-mono font-bold">{formattedTime}</div>
    </div>
  );
};

export default TimerDisplay;

