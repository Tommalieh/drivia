import React from 'react';

interface QuizTimerProps {
  seconds: number;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ seconds }) => {
  // Format MM:SS
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return (
    <div className={`font-mono text-lg ${seconds <= 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
      {min}:{sec}
    </div>
  );
};

export default QuizTimer;
