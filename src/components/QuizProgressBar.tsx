import React from 'react';

interface QuizProgressBarProps {
  current: number; // 1-based index
  total: number;
}

const QuizProgressBar: React.FC<QuizProgressBarProps> = ({ current, total }) => (
  <div className='w-2/3'>
    <div className='flex justify-between mb-1 text-sm font-medium'>
      <span>
        Question {current} of {total}
      </span>
    </div>
    <div className='w-full bg-gray-200 rounded-full h-2'>
      <div
        className='bg-primary h-2 rounded-full transition-all'
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default QuizProgressBar;
